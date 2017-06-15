import axios from 'axios';
import { document } from './actionTypes';
import setAuthentication from '../utils/setAuthentication';

/**
 * Requests for all accessible documents (paginated) from the API
 * @param {Number} limit The number of documents to return
 * @param {Number} offset The number of documents to offset results by
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getAllDocuments(limit, offset) {
  return dispatch => (
    axios.get(`/api/documents?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.GET_ALL_SUCCESS,
          documents: res.data.list,
          metadata: res.data.metadata
        });
      }, (err) => {
        dispatch({
          type: document.GET_ALL_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests for a particular document by ID from the API
 * @param {String} id The ID of the document to be retrieved
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function getDocument(id) {
  return dispatch => (
    axios.get(`/api/documents/${id}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.GET_SUCCESS,
          document: res.data,
        });
      }, (err) => {
        dispatch({
          type: document.GET_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests for documents matching a query (paginated) from the API
 * @param {String} query The search terms to be matched
 * @param {Number} limit The number of documents to return
 * @param {Number} offset The number of documents to offset results by
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function searchDocuments(query, limit, offset) {
  return dispatch => (
    axios.get(
      `/api/search/documents?q=${query}&limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.SEARCH_SUCCESS,
          results: res.data.list,
          metadata: res.data.metadata
        });
      }, (err) => {
        dispatch({
          type: document.SEARCH_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to create a document
 * @param {Object} newDocument The details of the document to be created
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function createDocument(newDocument) {
  return dispatch => (
    axios.post('/api/documents', newDocument)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.CREATE_SUCCESS,
          document: res.data,
        });
      }, (err) => {
        dispatch({
          type: document.CREATE_FAILURE,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to update a document
 * @param {String} id The ID of the document to be updated
 * @param {Object} patch The attributes to be updated
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function updateDocument(id, patch) {
  return dispatch => (
    axios.put(`/api/documents/${id}`, patch)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.UPDATE_SUCCESS,
          document: res.data
        });
      }, (err) => {
        dispatch({
          type: document.UPDATE_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}

/**
 * Requests the API to delete a document
 * @param {String} id The ID of the document to be deleted
 * @returns {Function} A thunk that asynchronously makes the request/dispatch
 */
export function deleteDocument(id) {
  return dispatch => (
    axios.delete(`/api/documents/${id}`)
      .then((res) => {
        setAuthentication(res.headers['x-access-token']);
        dispatch({
          type: document.DELETE_SUCCESS,
          id
        });
      }, (err) => {
        dispatch({
          type: document.DELETE_FAILURE,
          id,
          error: (typeof err.response.data === 'object')
            ? err.response.data
            : { message: 'Connection failed' }
        });
      }));
}
