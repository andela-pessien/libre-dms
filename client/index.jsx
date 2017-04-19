import React from 'react';
import ReactDOM from 'react-dom';
import './images/favicon.ico';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Bold.woff';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Bold.woff2';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Light.woff';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Light.woff2';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Medium.woff';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Medium.woff2';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Regular.woff';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Regular.woff2';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Thin.woff';
import '../node_modules/materialize-css/dist/fonts/roboto/Roboto-Thin.woff2';
import '../node_modules/materialize-css/dist/css/materialize.css';
import '../node_modules/jquery/dist/jquery';
import '../node_modules/materialize-css/dist/js/materialize';
import './styles/index.scss';
import App from './components/App';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
