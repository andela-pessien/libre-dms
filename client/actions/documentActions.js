import axios from 'axios';
import { document } from './actionTypes';
import setAccessToken from '../utils/setAccessToken';

export function getAllDocuments(limit, offset) {
  limit = limit || 10;
  offset = offset || 0;
  return (dispatch) => {
    return axios.get(`/api/documents?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAccessToken(res.headers['x-access-token']);
        const metadata = res.headers['x-list-metadata'];
        dispatch({
          type: document.GET_ALL_SUCCESS,
          documents: res.data,
          metadata: Buffer.from(metadata, 'base64').toString('utf8')
        });
      }, (err) => {
        dispatch({
          type: document.GET_ALL_FAILURE,
          error: err
        });
      });
  };
}

export function searchDocuments(query, limit, offset) {
  limit = limit || 10;
  offset = offset || 0;
  return (dispatch) => {
    return axios.get(`/api/search/documents?q=${query}&limit=${limit}&offset=${offset}`)
      .then((res) => {
        setAccessToken(res.headers['x-access-token']);
        const metadata = res.headers['x-search-metadata'];
        dispatch({
          type: document.SEARCH_SUCCESS,
          results: res.data,
          metadata: Buffer.from(metadata, 'base64').toString('utf8')
        });
      }, (err) => {
        dispatch({
          type: document.SEARCH_FAILURE,
          error: err
        });
      });
  };
}
