import React, { Component } from 'react';

/**
 * Menu button for mobile views
 * @author Princess-Jewel Essien
 */
class MobileMenuButton extends Component {
  /**
   * Runs when the MobileMenuButton has mounted
   * Initializes Materialize jQuery plugin for side navigation menus
   * @returns {undefined}
   */
  componentDidMount() {
    $('.button-collapse').sideNav({
      closeOnClick: true,
      draggable: true
    });
  }

  /**
   * Renders the MobileMenuButton component
   * @returns {String} JSX markup for the mobile menu button
   */
  render() {
    return (
      <a href="#!" data-activates="mobile-side-menu" className="button-collapse">
        <i className="material-icons">menu</i>
      </a>
    );
  }
}

export default MobileMenuButton;
