import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../actions/authActions';

/**
 * Account Menu component
 * @author Princess-Jewel Essien
 */
class AccountMenu extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  /**
   * Runs when the AccountMenu component has mounted.
   * Initializes the Materialize jQuery plugin for dropdown menus.
   * @returns {undefined}
   */
  componentDidMount() {
    $('.dropdown-button').dropdown({
      hover: true,
      belowOrigin: true,
      alignment: 'right'
    });
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
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li>
          <div
            className="dropdown-button avatar avatar-small"
            data-activates="account-dropdown"
          >
            {this.props.user.name[0]}
          </div>
          <ul id="account-dropdown" className="dropdown-content account-menu">
            <li><a>Hi, {this.props.user.name.split(/\s+/)[0]}</a></li>
            <li className="divider" />
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <a href="#!" onClick={this.onSignOutClick}>Sign Out</a>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer[ownProps.ownId].user
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
});

AccountMenu.propTypes = {
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu);
