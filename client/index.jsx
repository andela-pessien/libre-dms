import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import 'materialize-css/dist/fonts/roboto/Roboto-Bold.woff';
import 'materialize-css/dist/fonts/roboto/Roboto-Bold.woff2';
import 'materialize-css/dist/fonts/roboto/Roboto-Light.woff';
import 'materialize-css/dist/fonts/roboto/Roboto-Light.woff2';
import 'materialize-css/dist/fonts/roboto/Roboto-Medium.woff';
import 'materialize-css/dist/fonts/roboto/Roboto-Medium.woff2';
import 'materialize-css/dist/fonts/roboto/Roboto-Regular.woff';
import 'materialize-css/dist/fonts/roboto/Roboto-Regular.woff2';
import 'materialize-css/dist/fonts/roboto/Roboto-Thin.woff';
import 'materialize-css/dist/fonts/roboto/Roboto-Thin.woff2';
import 'materialize-css/dist/css/materialize.css';
import 'jquery';
import 'materialize-css/dist/js/materialize';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import './images/favicon.ico';
import './fonts/MaterialIcons.woff2';
import './styles/common.scss';
import routes from './routes';
import configureStore from './store/configureStore';
import setAccessToken from './utils/setAccessToken';

const store = configureStore();
setAccessToken();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
