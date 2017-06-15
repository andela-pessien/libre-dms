import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
   * @param {Object} event The signout click event
   * @returns {undefined}
   */
  onSignOutClick(event) {
    event.preventDefault();
    this.props.signOut();
  }

  /**
   * Renders the Navbar component.
   * @returns {String} - HTML markup for Navbar component
   */
  render() {
    return (
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><p>Hi, {this.props.user.name.split(/\s+/)[0]}</p></li>
        <li>
          <div
            className="dropdown-button avatar avatar-small"
            data-activates="account-dropdown"
          >
            <i className="material-icons">person</i>
          </div>
          <ul id="account-dropdown" className="dropdown-content account-menu">
            <li>
              <a className="signout" href="#!" onClick={this.onSignOutClick}>Sign Out</a>
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
