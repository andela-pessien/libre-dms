import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signOut } from '../../actions/authActions';

/**
 * Side Menu for small and mobile devices
 * @author Princess-Jewel Essien
 */
export class MobileSideMenuComponent extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.onOwnDocumentsClick = this.onOwnDocumentsClick.bind(this);
    this.onPublicButtonClick = this.onPublicButtonClick.bind(this);
    this.onPeopleButtonClick = this.onPeopleButtonClick.bind(this);
    this.onSettingsButtonClick = this.onSettingsButtonClick.bind(this);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  /**
   * Runs when the MobileSideMenu has mounted
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
   * Click event handler for selecting own documents option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onOwnDocumentsClick(event) {
    event.preventDefault();
    this.props.changeFeedView('showOwnFeed');
    this.props.getOwnDocuments();
  }

  /**
   * Click event handler for selecting all documents option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPublicButtonClick(event) {
    event.preventDefault();
    this.props.changeFeedView('showAllFeed');
    this.props.getAllDocuments();
  }

  /**
   * Click event handler for selecting other users option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPeopleButtonClick(event) {
    event.preventDefault();
    this.props.changeFeedView('showPeopleFeed');
    this.props.getAllUsers();
  }

  /**
   * Click event handler for selecting settings option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onSettingsButtonClick(event) {
    event.preventDefault();
    this.props.changeFeedView('showSettingsFeed');
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
   * Renders the mobile side menu component
   * @returns {String} JSX markup for the MobileSideMenu
   */
  render() {
    return (
      <ul id="mobile-side-menu" className="side-nav">
        <li className="mobile-greeting"><h5>Hi, {this.props.user.name.split(/\s+/)[0]}</h5></li>
        <li><div className="divider" /></li>
        <li onClick={this.onOwnDocumentsClick}>
          <a><i className="material-icons">insert_drive_file</i> My Documents</a>
        </li>
        <li onClick={this.onPublicButtonClick}>
          <a><i className="material-icons">public</i> All Documents</a>
        </li>
        <li onClick={this.onPeopleButtonClick}>
          <a><i className="material-icons">people</i> All Users</a>
        </li>
        <li onClick={this.onSettingsButtonClick}>
          <a><i className="material-icons">settings</i> Settings</a>
        </li>
        <li><div className="divider" /></li>
        <li onClick={this.onSignOutClick}>
          <a><i className="material-icons">power_settings_new</i> Sign Out</a>
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

MobileSideMenuComponent.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  changeFeedView: PropTypes.func.isRequired,
  getOwnDocuments: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileSideMenuComponent);
