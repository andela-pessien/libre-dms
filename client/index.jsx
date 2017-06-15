/** React/Redux **/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
/** JQuery **/
import 'jquery';
/** Materialize **/
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize';
/** QuillJS Styles **/
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
/** Favicon **/
import './images/favicon.ico';
/** Fonts **/
import './fonts/MaterialIcons.woff2';
/** Own Styles **/
import './styles/common.scss';
/** Store Creator **/
import configureStore from './store/configureStore';
/** Authentication **/
import setAuthentication from './utils/setAuthentication';
/** Main application component **/
import App from './components/App';

const store = configureStore();
setAuthentication(null, store);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
