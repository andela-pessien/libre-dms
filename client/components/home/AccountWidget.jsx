import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { signOutAction } from '../../actions/authActions';

class AccountWidget extends Component {
  constructor(props) {
    super(props);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user) {
      browserHistory.push('/');
    }
  }

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
          <li><a href="#!" onClick={this.onSignOutClick}>Sign Out</a></li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOutAction())
  };
};

export default connect(undefined, mapDispatchToProps)(AccountWidget);
