import axios from 'axios';
import {
  FETCHING_PROFILE,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
  RETURN_BOOK_SUCCESS,
  RETURN_BOOK_REQUEST,
  RETURN_BOOK_FAILURE,
} from './types';
import { apiURL } from './signUp';
import checkError from '../helpers/checkError';
import setHeader from '../helpers/setHeader';
import Notify from '../helpers/Notify';

const fetchingProfile = () => ({
  type: FETCHING_PROFILE,
});

const profileSuccess = profile => ({
  type: PROFILE_SUCCESS,
  profile,
});

const profileFailure = error => ({
  type: PROFILE_FAILURE,
  error,
});

export const getUserProfile = userId => (dispatch) => {
  dispatch(fetchingProfile());
  setHeader();
  return axios.get(`${apiURL}/users/${userId}`)
    .then((response) => {
      dispatch(profileSuccess(response.data.user));
    })
    .catch((error) => {
      const errorMessage = checkError(error);
      dispatch(profileFailure(errorMessage));
    });
};

const returningBook = () => ({
  type: RETURN_BOOK_REQUEST,
});

const returnBookSuccess = returnRequest => ({
  type: RETURN_BOOK_SUCCESS,
  returnRequest,
});

const returnBookFailure = () => ({
  type: RETURN_BOOK_FAILURE,
});

export const returnBook = (userId, bookId) => (dispatch) => {
  dispatch(returningBook());
  setHeader();
  return axios.post(`${apiURL}/users/${userId}/return/${bookId}`)
    .then((response) => {
      dispatch(returnBookSuccess(response.data.returnRequest));
      Notify.notifySuccess('Your request to return book has been sent');
    })
    .catch((error) => {
      const errorMessage = checkError(error);
      dispatch(returnBookFailure());
      Notify.notifyError(`Error sending return request.${errorMessage}`);
    });
};

