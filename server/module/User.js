// Import necessary modules
import bcryptjs from 'bcryptjs';
import models from '../models';
import createToken from '../controllers/auth/createToken';

export default class Users {
  /* Method implements user registration
  @params firstName, lastName, email, role and password
  of user a stored in the User's table
  @return user object
  */
  static signUp(req, res) {
    // Hash user's password
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);
    let userRole;

    // Assign the first user to sign up Admin role
    models.User.findAll({})
      .then((users) => {
        console.log(users.length);
        if (users.length === 0) {
          userRole = 'Admin';
        } else {
          userRole = 'User';
        }
        return models.User
          .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            role: userRole,
          })
          .then((user) => {
            // Provides user with token
            const token = createToken(user);
            res.status(201).json({ msg: 'Signup successful', token });
          })
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
    // Add user object to database
  }
  /* Method implements user login
  * @params email is used to find a user stored in the User's table
  * @return user object
  * @return msg string
  */
  static logIn(req, res) {
    // Check if user exists in database
    return models.User
      .findOne({
        where:
          { email: req.body.email },
      }).then((user) => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        // Checks if user-provided password is valid
        const passwordMatch = bcryptjs.compareSync(req.body.password, user.password);
        if (!passwordMatch) return res.status(401).json({ msg: 'Authentication failed' });
        // Provides authenticated user with token
        const token = createToken(user);
        res.status(201).json({ msg: 'Login successful', token });
      })
      .catch(error => res.status(500).json(error));
  }

  /* Method votes up a book
  * @param req is the request object
  * @param res is the response object
  */
  static upvoteBook(req, res) {
    // Check if book exists in database
    return models.Book.findById(req.params.bookId)
      .then((book) => {
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        // Check if user has upvoted book before
        models.Upvotes.findOrCreate({
          where: {
            bookId: req.params.bookId,
            userId: req.params.userId,
          },
        })
          .spread((upvote, created) => {
            // Increment book upvotes if user has not upvoted book
            if (created === true) {
              return book.increment('upvotes')
                // Increment upvotes and return current value
                .then(upVote => upVote.reload())
                .then(upvotedBook => res.status(201).json({
                  msg: 'Successfully upvoted book',
                  bookId: req.params.bookId,
                  upvotes: upvotedBook.upvotes,
                }))
                .catch(error => res.status(500).json({
                  msg: 'Error upvoting book',
                  error,
                }));
            }
            return res.status(403).json({ msg: 'Already upvoted book' });
          })
          .catch((error) => {
            res.status(500).json({
              msg: 'Error upvoting book',
              error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({ msg: 'Error upvoting book', error });
      });
  }


  /* Method votes down a book
  * @param req is the request object
  * @param res is the response object
  */
  static downvoteBook(req, res) {
    // Check if book exists in database
    return models.Book.findById(req.params.bookId)
      .then((book) => {
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        // Check if user has downvoted book before
        models.Downvotes.findOrCreate({
          where: {
            bookId: req.params.bookId,
            userId: req.params.userId,
          },
        }).spread((downvote, created) => {
          // Increment book upvotes if user has not upvoted book
          if (created === true) {
            return book.increment('downvotes')
            // Increment upvotes and return current value
              .then(downVote => downVote.reload())
              .then(downvotedBook => res.status(201).json({
                msg: 'Successfully downvoted book',
                bookId: req.params.bookId,
                downvotes: downvotedBook.downvotes,
              }))
              .catch(error => res.status(500).json({
                msg: 'Error downvoting book',
                error,
              }));
          }
          return res.status(403).json({ msg: 'Already downvoted book' });
        })
          .catch((error) => {
            res.status(500).json({
              msg: 'Error downvoting book',
              error,
            });
          });
      })
      .catch((error) => {
        res.status(500).json({ msg: 'Error downvoting book', error });
      });
  }

  /* Method lets a user favorite a book
  * @param req is the request is the request object
  * @param res is the response object
  * @return favoriteBook object */
  static favoriteBook(req, res) {
    models.Book.findById(req.params.bookId)
      .then((book) => {
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        return models.Favorites.findOrCreate({
          where: {
            bookId: req.params.bookId,
            userId: req.params.userId,
          },
        })
          .spread((favorite, created) => {
            if (created === true) {
              book.increment('favCount');
              return res.status(201).json({ msg: `Favorited book ${req.params.bookId}` });
            }
            return res.status(401).json({ msg: 'Already favorited book' });
          })
          .catch(error => res.status(400).send({
            msg: 'Error favoriting book', error,
          }));
      })
      .catch(error => res.status(400).json({
        msg: 'Error favoriting book', error,
      }));
  }

  /* Method gets a user's favorite books
  @param userId is used to find the index of the user in the
  users.json file and get favorites book if any */
  static getFavoriteBooks(req, res) {
    return models.Favorites.findAll({
      where: {
        userId: req.params.userId,
      },
      include: [{
        model: models.Book,
        as: 'favBook',
      }],
    })
      .then((books) => {
        if (books.length > 0) return res.status(201).json(books);
        return res.status(404).json('No favorites');
      })
      .catch((error) => {
        res.status(400).send({
          msg: 'Error fetching favorites book',
          error,
        });
      });
  }
  /* Method lets a user review a book
  * @param req is the request is the request object
  * @param res is the response object
  * @return review object is */
  static reviewBook(req, res) {
    models.Book.findById(req.params.bookId)
      .then((book) => {
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        return models.Review.findOrCreate({
          where: {
            bookId: req.params.bookId,
            userId: req.params.userId,
            review: req.body.review,
          },
        })
          .spread((review, created) => {
            if (created === true) {
              return res.status(201).json({ msg: `Successfully reviewed book ${req.params.bookId}`, review });
            }
            return res.status(403).json({ msg: 'Your review has already been created' });
          })
          .catch(error => res.status(400).send({
            msg: 'Error reviewing book', error,
          }));
      })
      .catch(error => res.status(400).json({
        msg: 'Error reviewing book', error,
      }));
  }

  /* Method lets a user get all books in the database
  * @param req is the request is the request object
  * @param res is the response object
  * @return book object is */
  static getAllBooks(req, res) {
    if (req.query.sort === 'upvotes' && req.query.order === 'desc') {
      return models.Book.findAll({
        include: [{
          model: models.Review,
          as: 'bookReviews',
        }],
        order: [
          ['upvotes', 'DESC'],
          [{ model: models.Review, as: 'bookReviews' }, 'createdAt', 'ASC'],
        ],
      })
        .then(book => res.status(201).json(book))
        .catch(error => res.status(400).json(error));
    }
    return models.Book.findAll({
      // Join book reviews
      include: [{
        model: models.Review,
        as: 'bookReviews',
      }],
    })
      .then((books) => {
        if (!books) return res.status(404).json({ msg: 'No book found' });
        return res.status(200).json({ msg: 'Successfully got all books', books });
      })
      .catch(err => res.status(400).json(err));
  }

  /* Method lets a user get a book in the database
  * @param req is the request object
  * @param res is the response object
  * @return book object is */
  static getBook(req, res) {
    return models.Book.find({
      where: {
        id: req.params.bookId,
      },
      // Join book reviews
      include: [{
        model: models.Review,
        as: 'bookReviews',
      }],
    })
      .then((book) => {
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        return res.status(200).json({ msg: 'Successfully got book', book });
      })
      .catch(err => res.status(400).json(err));
  }


  /* Method lets a user send  a borrow request for a book
  @param req is the request object
  @param res is the response object
  @return json object */
  static sendBorrowRequest(req, res) {
    models.Book.findById(req.params.bookId)
      .then((book) => {
        // Check if book is in database
        if (!book) return res.status(404).json({ msg: 'Book not found' });
        // Check if book is available
        if (book.quantity === 0) return res.status(403).json({ msg: 'Book is not available' });
        // Check if user has sent request before
        return models.BorrowRequests.find({
          where: {
            bookId: req.params.bookId,
            userId: req.params.userId,
            status: 'Pending',
          },
        })
          .then((borrowRequest) => {
            if (!borrowRequest) {
              return models.BorrowRequests.create({
                bookId: req.params.bookId,
                userId: req.params.userId,
                reason: req.body.reason,
                returnDate: req.body.returnDate,
                comments: req.body.comments,
              })
                .then(request => res.status(201).json({ msg: 'Borrow request sent', request }))
                .catch(error => res.status(400).json({ msg: 'Failed', error }));
            }
            return res.status(403).json({ msg: 'Already sent request' });
          })
          .catch(error => res.status(500).json(error));
      }).catch(error => res.status(500).json(error));
  }

  /* Method lets a user send  a return request for a book
  @param req is request object
  @param res is response object
  @return request object */
  static sendReturnRequest(req, res) {
    return models.BorrowedBooks.find({
      where: {
        userId: req.params.userId,
        bookId: req.params.bookId,
      },
    })
      .then((borrowed) => {
        if (!borrowed) return res.status(404).json({ msg: 'Book not borrowed' });
        models.ReturnRequests.find({
          where: {
            userId: req.params.userId,
            bookId: req.params.bookId,
            status: 'Pending',
          },
        })
          .then((request) => {
            if (!request) {
              return models.ReturnRequests.create({
                bookId: req.params.bookId,
                userId: req.paraams.userId,
                comments: req.params.comments,
              })
                .then(returnRequest => res.status(201).json({ msg: 'Success', returnRequest }))
                .catch(error => res.status(400).send(error));
            }
            return res.status(403).json({ msg: 'Your request has already been sent' });
          })
          .catch(error => res.status(400).json({ msg: 'Error sending request', error }));
      })
      .catch(error => res.status(400).json({ msg: 'Error sending request', error }));
  }
}
