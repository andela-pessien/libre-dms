import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { signOutAction } from '../../actions/authActions';

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
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  /**
   * Runs when the Navbar component has mounted.
   * Initializes the Materialize jQuery plugin for dropdown menus.
   * @returns {undefined}
   */
  componentDidMount() {
    $('.dropdown-button').dropdown();
  }

  /**
   * Runs when the Navbar component's props have changed.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      browserHistory.push('/');
    }
  }

  /**
   * Event listener/handler for clicking on the sign out menu option.
   * @param {Object} e The signout click event
   * @returns {undefined}
   */
  onSignOutClick(e) {
    e.preventDefault();
    this.props.signOut();
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
          <ul id="nav-mobile" className="right">
            <li>
              <div
                className="dropdown-button avatar-small"
                data-activates="account-dropdown"
              >
                {this.props.user.name[0]}
              </div>
              <ul id="account-dropdown" className="dropdown-content">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><a href="#!" onClick={this.onSignOutClick}>Sign Out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStoreToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOutAction())
});

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  signOut: PropTypes.func.isRequired
};

export default connect(mapStoreToProps, mapDispatchToProps)(Navbar);
