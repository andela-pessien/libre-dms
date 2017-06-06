import React from 'react';
import AuthPanel from './AuthPanel';
import logo from '../../images/labeledlogo-white.png';

const AuthPage = () => (
  <div className="auth-page-wrapper row">
    <div className="col l7 hide-on-med-and-down">
      <div className="logo-image">
        <img src={logo} alt="logo" />
      </div>
    </div>
    <AuthPanel />
  </div>
);

export default AuthPage;
