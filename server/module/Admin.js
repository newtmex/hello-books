// Import necessary modules
import models from '../models';
import Users from '../module/User';

export default class Admin extends Users {
  /* Method adds a book
  * @param bookId is the book's id
  * @param title is the book's title
  * @param author is the book's author
  * @param description is the book's description
  * @param imageURL is the book's image URL
  * @param subject is the book's subject
  * @param quantity is the book's quantity
  * @ return book object
  * @return msg string
  */
  static addBook(req, res) {
    return models.Book
      .create({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        subject: req.body.subject,
        imageURL: req.body.imageURL,
        quantity: req.body.quantity,
      })
      .then((book) => {
        res.status(201).json({ msg: 'Successfully added book', book });
      })
      .catch((error) => {
        res.status(500).json({ msg: error });
      });
  }

  /* Method modifies a book
  * @param res is the response object
  * @param req is the request object
  * @return updatedBook object
  */
  static updateBook(req, res) {
    return models.Book.findById(req.params.bookId)
      .then((book) => {
        // Check if book exists
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        // Update book
        return book.update({
          id: req.params.bookId,
          title: req.body.title || book.title,
          author: req.body.author || book.author,
          description: req.body.description || book.description,
          subject: req.body.subject || book.subject,
          imageURL: req.body.imageURL || book.imageURL,
          quantity: req.body.quantity || book.quantity,
        })
          .then(updatedBook => res.status(201).json({
            msg: 'Successfully updated book', updatedBook,
          }))
          .catch(error => res.status(500).json({
            msg: 'Book not updated', error,
          }));
      })
      .catch(error => res.status(500).json({ msg: 'Book not updated', error }));
  }

  /* Method accepts or declines a borrow request
  @param bookId is the book's id
  @param action takes in 'Accept' or 'Decline'
  */
  static handleBorrowRequest(req, res) {
    const status = req.body.status;
    return models.BorrowRequests.find({
      where: {
        userId: req.params.userId,
        bookId: req.params.bookId,
      },
    })
      .then((request) => {
        if (!request) return res.status(404).json({ msg: 'Request not found' });
        if (request.status !== 'Pending') return res.status(403).json({ msg: 'Already handled request' });

        return request.update({
          status: req.body.status,
        })
          .then((updatedRequest) => {
            if (status === 'Accepted') {
              models.BorrowedBooks.create({
                userId: req.params.userId,
                bookId: req.params.bookId,
              });
              models.Book.findById(req.params.bookId)
                .then((book) => {
                  book.increment('borrowCount');
                  book.decrement('quantity');
                })
                .catch(error => res.status(400).json({ msg: 'Error handling request', error }));
              return res.status(201).json({ msg: 'Accepted request', updatedRequest });
            }
            return res.status(201).json({ msg: 'Declined request', updatedRequest });
          })
          .catch(error => res.status(400).json({ msg: 'Error handling request', error }));
      });
  }

  /* Method accepts or declines a return request
  @param bookId is the book's id
  @param action takes in 'Accept' or 'Decline'
  */
  handleReturnRequest(userId, bookId, action) {
    this.userId = userId;
    this.bookId = bookId;
    this.action = action;
  }
}