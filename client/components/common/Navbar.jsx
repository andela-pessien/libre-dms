import React, { Component } from 'react';
import requireAuth from '../authentication/requireAuth';
import AccountMenu from './AccountMenu';

/**
 * Navbar component
 * @author Princess-Jewel Essien
 */
class Navbar extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.requireAuth = requireAuth(AccountMenu);
  }

  /**
   * Renders the Navbar component.
   * @returns {String} - HTML markup for Navbar component
   */
  render() {
    return (
      <nav className="app-navbar">
        <div className="nav-wrapper">
          <a className="brand-logo" href="/">LibreDMS</a>
          <this.requireAuth />
        </div>
      </nav>
    );
  }
}

export default Navbar;
