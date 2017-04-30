import React, { Component } from 'react';
import HomePanel from './HomePanel';
import logo from '../../images/labeledlogo-white.png';

class LandingPage extends Component {
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
        <HomePanel />
      </div>
    );
  }
}

export default LandingPage;
