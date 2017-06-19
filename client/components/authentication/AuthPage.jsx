import React from 'react';
import AuthPanel from './AuthPanel';
import logo from '../../images/labeledlogo-white.png';
import { Desktop, Small, Mobile } from '../../utils/responsive';

/**
 * Authentication page for application
 * @returns {undefined}
 */
const AuthPage = () => (
  <div className="auth-page-wrapper">
    <Desktop className="row">
      <div className="col l7 hide-on-med-and-down">
        <div className="logo-image">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="col l5">
        <AuthPanel />
      </div>
    </Desktop>
    <Small>
      <AuthPanel />
    </Small>
    <Mobile>
      <AuthPanel />
    </Mobile>
  </div>
);

export default AuthPage;
