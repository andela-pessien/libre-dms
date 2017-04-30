import React from 'react';
import { connect } from 'react-redux';
import AuthPanel from './AuthPanel';
import HomeFeedPanel from './HomeFeedPanel';

function HomePanel({ isAuthenticated, user }) {
  if (isAuthenticated) {
    return (<HomeFeedPanel user={user} />);
  }
  return (<AuthPanel />);
}

const mapStoreToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
    user: state.authReducer.user
  };
};

export default connect(mapStoreToProps)(HomePanel);
