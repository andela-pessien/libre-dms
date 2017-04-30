import React, { Component } from 'react';
import SignInForm from '../authentication/SignInForm';
import SignUpForm from '../authentication/SignUpForm';

class AuthPanel extends Component {
  /**
   * Renders the AuthPanel component.
   * @returns {String} - HTML markup for AuthPanel component
   */
  render() {
    return (
      <div className="col l5">
        <div className="card auth-panel medium white">
          <div className="card-tabs">
            <ul className="tabs tabs-fixed-width">
              <li className="tab">
                <a className="active" href="#signup">Sign Up</a>
              </li>
              <li className="tab"><a href="#signin">Sign In</a></li>
            </ul>
          </div>
          <div className="card-content">
            <div id="signup">
              <SignUpForm />
            </div>
            <div id="signin">
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPanel;
