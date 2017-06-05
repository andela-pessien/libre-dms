import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { getCurrentUser } from '../actions/authActions';

/**
 * Function that sets the access token for API requests
 * @param {String} token The token to be set (optional)
 * @param {Boolean} store The application store (optional)
 * @returns {void}
 */
export default function setAuthentication(token, store) {
  if (!(token || token === '')) {
    token = localStorage.getItem('libredms-token');
  }
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.id) {
        axios.defaults.headers.common['x-access-token'] = token;
        if (store) {
          store.dispatch(getCurrentUser(decoded.id));
        }
        localStorage.setItem('libredms-token', token);
      } else {
        delete axios.defaults.headers.common['x-access-token'];
        localStorage.removeItem('libredms-token');
      }
    } catch (err) {
      delete axios.defaults.headers.common['x-access-token'];
      localStorage.removeItem('libredms-token');
    }
  } else {
    delete axios.defaults.headers.common['x-access-token'];
    localStorage.removeItem('libredms-token');
  }
}
