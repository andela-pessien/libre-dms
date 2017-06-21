import React, { Component } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

/**
 * Home page panel that holds authentication components.
 * @author Princess-Jewel Essien
 */
class AuthPanel extends Component {
  /**
   * Runs when the AuthPanel component has mounted.
   * Initializes the Materialize jQuery plugin for tabbed content.
   * @returns {undefined}
   */
  componentDidMount() {
    $('.tabs').tabs();
  }

  /**
   * Renders the AuthPanel component.
   * @returns {String} - HTML markup for AuthPanel component
   */
  render() {
    return (
      <div className="card auth-panel white">
        <div className="card-tabs">
          <ul className="tabs tabs-fixed-width">
            <li className="tab">
              <a className="signup-tab active" href="#signup">Sign Up</a>
            </li>
            <li className="tab">
              <a className="signin-tab" href="#signin">Sign In</a>
            </li>
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
    );
  }
}

export default AuthPanel;
