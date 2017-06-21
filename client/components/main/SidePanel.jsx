import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DocumentFeed from '../document/DocumentFeed';
import UserFeed from '../user/UserFeed';
import Preloader from '../common/Preloader';
import Pagination from '../common/Pagination';

/**
 * Component that renders a side panel holding various feeds.
 * On mobile it renders full-screen
 */
class SidePanel extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.onDocumentSelect = this.onDocumentSelect.bind(this);
    this.onProfileSelect = this.onProfileSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
  }

  /**
   * Click event handler for selecting a document
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onDocumentSelect(event) {
    event.preventDefault();
    const documentId = event.target.name || 'new';
    this.props.changeView('showDocumentId', documentId);
  }

  /**
   * Click event handler for selecting a user profile
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onProfileSelect(event) {
    event.preventDefault();
    const profileId = event.target.name || this.props.ownId;
    this.props.changeView('showProfileId', profileId);
  }

  /**
   * Click event handler for selecting a settings option
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onSettingsSelect(event) {
    event.preventDefault();
    this.props.changeView('showSettings', true);
  }

  /**
   * Renders the Side Panel component
   * @returns {String} JSX markup for the Side Panel
   */
  render() {
    return (
      <div className="card side-panel">
        {this.props.showOwnFeed &&
          <div className="card-content side-view">
            <span className="card-title">My Documents</span>
            {(this.props.self && this.props.self.documents)
              ? <div className="own-feed">
                <DocumentFeed
                  documents={this.props.self.documents}
                  documentClickAction={this.onDocumentSelect}
                  profileClickAction={this.onProfileSelect}
                />
                {this.props.self.documents.metadata &&
                  <Pagination
                    metadata={this.props.self.documents.metadata}
                    loadList={this.props.loadOwnDocuments}
                  />}
              </div>
              : (!this.props.self.error &&
                <Preloader classNames="middle" />)}
            </div>}
        {this.props.showAllFeed &&
          <div className="card-content side-view">
            <span className="card-title">All Documents</span>
            <div className="card search indigo darken-4 z-depth-4">
              <div className="search-input">
                <input
                  onChange={this.props.onDocumentSearchChange}
                  type="search"
                  placeholder="Search for a document"
                  value={this.props.documentKeywords}
                />
              </div>
            </div>
            <div className="public-feed">
              <DocumentFeed
                documents={this.props.documents}
                documentClickAction={this.onDocumentSelect}
                profileClickAction={this.onProfileSelect}
              />
              {this.props.documents.metadata &&
                <Pagination
                  metadata={this.props.documents.metadata}
                  loadList={
                    (this.props.documentKeywords)
                      ? this.props.searchDocuments.bind(
                          null,
                          this.props.documentKeywords
                        )
                      : this.props.getAllDocuments
                    }
                />}
            </div>
          </div>}
        {this.props.showPeopleFeed &&
          <div className="card-content side-view">
            <span className="card-title">Other People</span>
            <div className="card search indigo darken-4 z-depth-4">
              <div className="search-input">
                <input
                  onChange={this.props.onUserSearchChange}
                  type="search"
                  placeholder="Search for a user"
                  value={this.props.userKeywords}
                />
              </div>
            </div>
            <div className="people-feed">
              <UserFeed
                users={this.props.users}
                profileClickAction={this.onProfileSelect}
              />
              {this.props.users.metadata &&
                <Pagination
                  metadata={this.props.users.metadata}
                  loadList={
                    (this.props.userKeywords)
                      ? this.props.searchUsers.bind(
                          null,
                          this.props.userKeywords
                        )
                      : this.props.getAllUsers
                    }
                />}
            </div>
          </div>}
        {this.props.showSettingsFeed &&
          <div className="card-content side-view">
            <span className="card-title">Settings</span>
            <ul>
              <li>
                <h5>
                  <a href="#!" onClick={this.onProfileSelect}>My Profile</a>
                </h5>
              </li>
              <li>
                <h5>
                  <a href="#!" onClick={this.onSettingsSelect}>Security</a>
                </h5>
              </li>
            </ul>
          </div>}
        <a
          className="btn-floating btn-large new-doc z-depth-3"
          href="#!"
          onClick={this.onDocumentSelect}
        >
          <i className="material-icons">add</i>
        </a>
      </div>
    );
  }
}

SidePanel.propTypes = {
  ownId: PropTypes.string.isRequired,
  self: PropTypes.object.isRequired,
  showOwnFeed: PropTypes.bool.isRequired,
  showAllFeed: PropTypes.bool.isRequired,
  showPeopleFeed: PropTypes.bool.isRequired,
  showSettingsFeed: PropTypes.bool.isRequired,
  documentKeywords: PropTypes.string.isRequired,
  userKeywords: PropTypes.string.isRequired,
  documents: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  loadOwnDocuments: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  onDocumentSearchChange: PropTypes.func.isRequired,
  onUserSearchChange: PropTypes.func.isRequired
};

export default SidePanel;
