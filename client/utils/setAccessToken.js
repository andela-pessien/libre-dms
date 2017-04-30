import axios from 'axios';

/**
 * Function that sets the access token for API requests
 * @param {*} token
 * @returns {void}
 */
export default function setAccessToken(token) {
  if (token || token === '') {
    console.log(token);
    axios.defaults.headers.common['x-access-token'] = token;
    localStorage.setItem('libredms-token', token);
  } else if (localStorage.getItem('libredms-token')) {
    axios.defaults.headers.common['x-access-token'] =
      localStorage.getItem('libredms-token');
  }
}
