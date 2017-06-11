import axios from 'axios';
import { auth, user } from './actionTypes';
import decodeMetadata from '../utils/decodeMetadata';
import setAuthentication from '../utils/setAuthentication';
import { getRole } from '../utils/roles';

/**
 * Requests for all accessible users (paginated) from the API
 * @param {Number} limit The number of users to return
 * @param {Number} offset The number of users to offset results by
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getAllUsers(limit, offset) {
  limit = limit || 10;
  offset = offset || 0;
  return dispatch => (
    axios.get(`/api/users?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        const metadata = decodeMetadata(res.headers['x-list-metadata']);
        dispatch({
          type: user.GET_ALL_SUCCESS,
          users: res.data,
          metadata
        });
      }, (err) => {
        dispatch({
          type: user.GET_ALL_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      })
  );
}

/**
 * Requests for a particular user by ID from the API
 * @param {String} id The ID of the user to be retrieved
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getUser(id) {
  return dispatch => (
    axios.get(`/api/users/${id}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.GET_SUCCESS,
          user: res.data,
        });
      }, (err) => {
        dispatch({
          type: user.GET_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests for users matching a query (paginated) from the API
 * @param {String} query The search terms to be matched
 * @param {Number} limit The number of users to return
 * @param {Number} offset The number of users to offset results by
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function searchUsers(query, limit, offset) {
  limit = limit || 10;
  offset = offset || 0;
  return dispatch => (
    axios.get(
      `/api/search/users?q=${query}&limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        const metadata = decodeMetadata(res.headers['x-list-metadata']);
        dispatch({
          type: user.SEARCH_SUCCESS,
          results: res.data,
          metadata
        });
      }, (err) => {
        dispatch({
          type: user.SEARCH_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to update a user
 * @param {String} id The ID of the user to be updated
 * @param {Object} patch The attributes to be updated
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function updateUser(id, patch) {
  return dispatch => (
    axios.put(`/api/users/${id}`, patch)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.UPDATE_SUCCESS,
          user: res.data,
        });
      }, (err) => {
        dispatch({
          type: user.UPDATE_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to promote or demote a user's role
 * @param {String} id The ID of the user to be promoted/demoted
 * @param {Object} roleId The target role for the user
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function setUserRole(id, roleId) {
  return dispatch => (
    axios.put(`/api/users/${id}/set-role`, { roleId })
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.UPDATE_SUCCESS,
          user: res.data,
        });
        Materialize.toast(`User's role set to ${getRole(roleId)}`, 3000,
          'indigo darken-4 white-text rounded');
      }, (err) => {
        dispatch({
          type: user.UPDATE_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to delete a user
 * @param {String} id The ID of the user to be deleted
 * @param {Boolean} isSelf Whether or not the user to be deleted is the
 * currently signed in user
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function deleteUser(id, isSelf) {
  return dispatch => (
    axios.delete(`/api/users/${id}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: user.DELETE_SUCCESS,
          id
        });
        if (isSelf) {
          dispatch({
            type: auth.SIGNOUT_SUCCESS
          });
        }
      }, (err) => {
        dispatch({
          type: user.DELETE_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests for all accessible documents belonging to a particular user
 * (paginated) from the API
 * @param {String} id The ID of the user whose documents should be retrieved
 * @param {Number} limit The number of documents to return
 * @param {Number} offset The number of documents to offset results by
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getUserDocuments(id, limit, offset) {
  limit = limit || 10;
  offset = offset || 0;
  return dispatch => (
    axios.get(`/api/users/${id}/documents?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        const metadata = decodeMetadata(res.headers['x-list-metadata']);
        dispatch({
          type: user.GET_DOCS_SUCCESS,
          id,
          documents: res.data,
          metadata
        });
      }, (err) => {
        dispatch({
          type: user.GET_DOCS_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}
