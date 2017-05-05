import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../components/App';
import LandingPage from '../components/home/LandingPage';
import DocumentPage from '../components/document/DocumentPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage} />
    <Route path="/document/:param" component={DocumentPage} />
  </Route>
);
