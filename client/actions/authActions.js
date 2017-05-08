import axios from 'axios';
import { auth } from './actionTypes';
import setAccessToken from '../utils/setAccessToken';
import { saveCurrentUser } from '../utils/currentUser';

export function signUpAction(userData) {
  return (dispatch) => {
    return axios.post('/api/users', userData)
      .then((res) => {
        setAccessToken(res.headers['x-access-token']);
        saveCurrentUser(res.data);
        dispatch({
          type: auth.SIGNUP_SUCCESS,
        });
        dispatch({
          type: auth.SET_CURRENT_USER,
          user: res.data
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNUP_FAILURE,
          error: err
        });
      });
  };
}

export function signInAction(userData) {
  return (dispatch) => {
    return axios.post('/api/auth/login', userData)
      .then((res) => {
        setAccessToken(res.headers['x-access-token']);
        saveCurrentUser(res.data);
        dispatch({
          type: auth.SIGNIN_SUCCESS,
        });
        dispatch({
          type: auth.SET_CURRENT_USER,
          user: res.data
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNIN_FAILURE,
          error: err
        });
      });
  };
}

export function signOutAction() {
  return (dispatch) => {
    return axios.post('/api/auth/logout')
      .then((res) => {
        setAccessToken(res.headers['x-access-token']);
        saveCurrentUser(null);
        dispatch({
          type: auth.SIGNOUT_SUCCESS
        });
        dispatch({
          type: auth.SET_CURRENT_USER,
          user: null
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNOUT_FAILURE,
          error: err
        });
      });
  };
}
