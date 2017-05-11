import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../components/App';
import LandingPage from '../components/home/LandingPage';
import DocumentPage from '../components/document/DocumentPage';
import ProfilePage from '../components/user/ProfilePage';
import Dashboard from '../components/dashboard/Dashboard';
import requireAuth from '../components/authentication/requireAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LandingPage} />
    <Route
      path="/document/:param"
      component={requireAuth(DocumentPage, LandingPage)}
    />
    <Route
      path="/profile"
      component={requireAuth(ProfilePage, LandingPage)}
    />
    <Route
      path="/profile/:param"
      component={requireAuth(ProfilePage, LandingPage)}
    />
    <Route
      path="/dashboard"
      component={requireAuth(Dashboard, LandingPage)}
    />
  </Route>
);
