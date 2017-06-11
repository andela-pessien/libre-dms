import axios from 'axios';
import { auth, user } from './actionTypes';
import setAuthentication from '../utils/setAuthentication';

/**
 * Requests the API to sign up a user
 * @param {Object} userData The details of the user to be created
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function signUp(userData) {
  return dispatch => (
    axios.post('/api/users', userData)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.GET_SUCCESS,
          user: res.data
        });
        dispatch({
          type: auth.SIGNUP_SUCCESS,
          userId: res.data.id
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNUP_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      })
  );
}

/**
 * Requests the API to sign in a user
 * @param {Object} credentials The credentials of the user to be signed in
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function signIn(credentials) {
  return dispatch => (
    axios.post('/api/auth/login', credentials)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.GET_SUCCESS,
          user: res.data
        });
        dispatch({
          type: auth.SIGNIN_SUCCESS,
          userId: res.data.id
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNIN_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      })
  );
}

/**
 * Requests the API to sign out a user
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function signOut() {
  return dispatch => (
    axios.post('/api/auth/logout')
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: auth.SIGNOUT_SUCCESS
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNOUT_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      })
  );
}

/**
 * Retrieves the details of the currently signed in user from the API
 * This helps reflect updates/deletions since last login
 * @param {String} id The ID of the user to be retrieved
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getCurrentUser(id) {
  return dispatch => (
    axios.get(`/api/users/${id}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.GET_SUCCESS,
          user: res.data
        });
        dispatch({
          type: auth.SIGNIN_SUCCESS,
          userId: id
        });
      }, (err) => {
        dispatch({
          type: auth.SIGNIN_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      })
  );
}
