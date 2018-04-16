import {
  GET_BOOK_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_FAILURE,
  FAVORITE_REQUEST,
  FAVORITE_SUCCESS,
  FAVORITE_FAILURE,
  UPVOTE_REQUEST,
  UPVOTE_SUCCESS,
  UPVOTE_FAILURE,
  DOWNVOTE_REQUEST,
  DOWNVOTE_SUCCESS,
  DOWNVOTE_FAILURE,
  BORROW_BOOK_SUCCESS,
  BORROW_BOOK_REQUEST,
  BORROW_BOOK_FAILURE,
  REVIEW_BOOK_SUCCESS,
  REVIEW_BOOK_REQUEST,
  REVIEW_BOOK_FAILURE,
} from '../actions/types';

const initialState = {};

const book = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOK_REQUEST: {
      return {
        ...state,
        isFetching: true,
        book: null,
      };
    }
    case GET_BOOK_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    }
    case GET_BOOK_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        book: action.book,
      };
    }
    case FAVORITE_REQUEST: {
      return {
        ...state,
        isFavoriting: true,
      };
    }
    case FAVORITE_FAILURE: {
      Materialize.toast(action.error, 1000);
      return {
        ...state,
        isFavoriting: false,
      };
    }
    case FAVORITE_SUCCESS: {
      Materialize.toast('Book has been added to favorites', 2000);
      return {
        ...state,
        book: { ...state.book, favCount: action.favCount },
        isFavoriting: false,
      };
    }
    case UPVOTE_REQUEST: {
      return {
        ...state,
        isUpvoting: true,
      };
    }
    case UPVOTE_FAILURE: {
      Materialize.toast(action.error, 1000);
      return {
        ...state,
        isUpvoting: false,
      };
    }
    case UPVOTE_SUCCESS: {
      return {
        ...state,
        book: { ...state.book, upvotes: action.book.upvotes, downvotes: action.book.downvotes },
        isUpvoting: false,
      };
    }
    case DOWNVOTE_REQUEST: {
      return {
        ...state,
        isDownvoting: true,
      };
    }
    case DOWNVOTE_FAILURE: {
      Materialize.toast(action.error, 1000);
      return {
        ...state,
        isDownvoting: false,
      };
    }
    case DOWNVOTE_SUCCESS: {
      return {
        ...state,
        book: { ...state.book, upvotes: action.book.upvotes, downvotes: action.book.downvotes },
        isDownvoting: false,
      };
    }
    case BORROW_BOOK_REQUEST: {
      return {
        ...state,
        isBorrowing: true,
      };
    }
    case BORROW_BOOK_FAILURE: {
      Materialize.toast(action.error, 1000);
      return {
        ...state,
        isBorrowing: false,
      };
    }
    case BORROW_BOOK_SUCCESS: {
      Materialize.toast('Your borrow request has been sent. Check status in your profile', 2000);
      return {
        ...state,
        isBorrowing: false,
        borrowStatus: action.borrowStatus,
      };
    }
    case REVIEW_BOOK_REQUEST: {
      return {
        ...state,
        isReviewing: true,
      };
    }
    case REVIEW_BOOK_FAILURE: {
      Materialize.toast(action.error, 1000);
      return {
        ...state,
        isReviewing: false,
      };
    }
    case REVIEW_BOOK_SUCCESS: {
      return {
        ...state,
        book: action.book,
        isReviewing: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default book;
