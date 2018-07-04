import axios from 'axios';
import {
  FETCHING_FAVORITES,
  FAVORITES_SUCCESS,
  FAVORITES_FAILURE,
} from './types';
import setHeader from '../helpers/setheader';
import { apiURL } from './userSignUp';


const fetchingFavorites = () => ({
  type: FETCHING_FAVORITES,
});

const favoritesSuccess = ({ favorites, pagination }) => ({
  type: FAVORITES_SUCCESS,
  favorites,
  pagination,
});

const favoritesFailure = error => ({
  type: FAVORITES_FAILURE,
  error,
});

const getUserFavorites = (userId, page) => (dispatch) => {
  dispatch(fetchingFavorites());
  setHeader();
  return axios.get(`${apiURL}/users/${userId}/favBooks?page=${page}`)
    .then((response) => {
      dispatch(favoritesSuccess(response.data));
    })
    .catch((error) => {
      if (error.response) {
        let errorMessage = '';
        if (error.response.status === 404) {
          errorMessage = 'You currently have no favorites';
        } else {
          errorMessage = 'An error occured';
        }
        dispatch(favoritesFailure(errorMessage));
      } else {
        dispatch(favoritesFailure(error.message));
      }
    });
};

export default getUserFavorites;

