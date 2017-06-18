import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Side menu component for application.
 * Displays on large (desktop) screens.
 * @author Princess-Jewel Essien
 */
class SideMenu extends Component {
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
  }

  /**
   * Click event handler for selecting own documents option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onOwnDocumentsClick(event) {
    event.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#own-documents-button').addClass('active');
    this.props.changeFeedView('showOwnFeed');
    this.props.getUserDocuments(this.props.ownId);
  }

  /**
   * Click event handler for selecting all documents option from menu
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPublicButtonClick(event) {
    event.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#public-button').addClass('active');
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
    $('.fixed-side-menu-item').removeClass('active');
    $('#people-button').addClass('active');
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
    $('.fixed-side-menu-item').removeClass('active');
    $('#settings-button').addClass('active');
    this.props.changeFeedView('showSettingsFeed');
  }

  /**
   * Renders the SideMenu component
   * @returns {String} JSX markup for the SideMenu component
   */
  render() {
    return (
      <div className="fixed-side-menu">
        <div
          id="own-documents-button"
          className="fixed-side-menu-item active"
          onClick={this.onOwnDocumentsClick}
          role="menuitem"
        >
          <i
            className="material-icons tooltipped"
            data-position="bottom"
            data-tooltip="My documents"
          >insert_drive_file</i>
        </div>
        <div
          id="public-button"
          className="fixed-side-menu-item"
          onClick={this.onPublicButtonClick}
          role="menuitem"
        >
          <i
            className="material-icons tooltipped"
            data-position="bottom"
            data-tooltip="All documents"
          >public</i>
        </div>
        <div
          id="people-button"
          className="fixed-side-menu-item"
          onClick={this.onPeopleButtonClick}
          role="menuitem"
        >
          <i
            className="material-icons tooltipped"
            data-position="bottom"
            data-tooltip="Other People"
          >people</i>
        </div>
        <div
          id="settings-button"
          className="fixed-side-menu-item"
          onClick={this.onSettingsButtonClick}
          role="menuitem"
        >
          <i
            className="material-icons tooltipped"
            data-position="bottom"
            data-tooltip="Settings"
          >settings</i>
        </div>
      </div>
    );
  }
}

SideMenu.propTypes = {
  ownId: PropTypes.string.isRequired,
  changeFeedView: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired
};

export default SideMenu;
