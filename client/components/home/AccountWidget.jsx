import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { signOutAction } from '../../actions/authActions';

/**
 * Home page widget to display account details.
 * @author Princess-Jewel Essien
 */
class AccountWidget extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  /**
   * Runs when the AccountWidget component has mounted.
   * Initializes the Materialize jQuery plugin for dropdown menus.
   * @returns {undefined}
   */
  componentDidMount() {
    $('.dropdown-button').dropdown();
  }

  /**
   * Runs when the AccountWidget's component's props have changed.
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
   * Renders the AccountWidget component.
   * @returns {String} - HTML markup for AccountWidget component
   */
  render() {
    const { user } = this.props;
    return (
      <div className="account-widget valign-wrapper">
        <div className="account-details dark-outline">
          <div id="home-user-name">{user.name}</div>
          <div id="home-user-email">{user.email}</div>
        </div>
        <div
          className="dropdown-button avatar-small"
          data-activates="account-dropdown"
        >{user.name[0]}</div>
        <ul id="account-dropdown" className="dropdown-content">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><a href="#!" onClick={this.onSignOutClick}>Sign Out</a></li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOutAction())
});

AccountWidget.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  signOut: PropTypes.func.isRequired
};

export default connect(undefined, mapDispatchToProps)(AccountWidget);
