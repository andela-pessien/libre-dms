import React, { Component } from 'react';
import requireAuth from '../../utils/requireAuth';
import { Desktop, Small, Mobile } from '../../utils/responsive';
import AccountMenu from './AccountMenu';
import MobileMenuButton from './MobileMenuButton'

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
    this.AccountMenu = requireAuth(AccountMenu);
    this.MobileMenuButton = requireAuth(MobileMenuButton);
  }

  /**
   * Renders the Navbar component.
   * @returns {String} - HTML markup for Navbar component
   */
  render() {
    return (
      <nav className="app-navbar">
        <div className="nav-wrapper">
          <Small>
            <this.MobileMenuButton />
          </Small>
          <Mobile>
            <this.MobileMenuButton />
          </Mobile>
          <a className="brand-logo" href="/">LibreDMS</a>
          <Desktop>
            <this.AccountMenu />
          </Desktop>
        </div>
      </nav>
    );
  }
}

export default Navbar;
