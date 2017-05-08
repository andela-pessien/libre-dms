import React, { Component } from 'react';
import requireAuth from '../authentication/requireAuth';
// import HomePanel from './HomePanel';
import AuthPanel from './AuthPanel';
import HomeFeedPanel from './HomeFeedPanel';
import logo from '../../images/labeledlogo-white.png';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.requireAuth = requireAuth(HomeFeedPanel, AuthPanel);
  }
  /**
   * Renders the LandingPage component.
   * @returns {String} - HTML markup for LandingPage component
   */
  render() {
    return (
      <div className="home-wrapper row">
        <div className="col l7">
          <div className="logo-image">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <this.requireAuth />
      </div>
    );
  }
}

export default LandingPage;
