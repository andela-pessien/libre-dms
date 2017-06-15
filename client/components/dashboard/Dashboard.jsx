import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentFeed from '../document/DocumentFeed';
import UserFeed from '../user/UserFeed';
import Preloader from '../common/Preloader';
import Pagination from '../common/Pagination';
import ProfileView from '../user/ProfileView';
import DocumentView from '../document/DocumentView';
import SecurityPanel from './SecurityPanel';
import {
  getUser,
  getUserDocuments,
  getAllUsers,
  searchUsers
} from '../../actions/userActions';
import {
  getAllDocuments,
  searchDocuments
} from '../../actions/documentActions';

/**
 * Dashboard component for application
 * @author Princess-Jewel Essien
 */
class Dashboard extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.props.getUser(this.props.ownId);
    this.props.getUserDocuments(this.props.ownId);
    this.state = {
      showOwnFeed: true,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false,
      showMainView: false,
      showDocumentId: 'new',
      showProfileId: '',
      showSettings: false,
      documentKeywords: '',
      userKeywords: ''
    };
    this.documents = this.props.allDocuments;
    this.users = this.props.allUsers;
    this.onOwnDocumentsClick = this.onOwnDocumentsClick.bind(this);
    this.onPublicButtonClick = this.onPublicButtonClick.bind(this);
    this.onPeopleButtonClick = this.onPeopleButtonClick.bind(this);
    this.onSettingsButtonClick = this.onSettingsButtonClick.bind(this);
    this.onDocumentSelect = this.onDocumentSelect.bind(this);
    this.onProfileSelect = this.onProfileSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
    this.onDocumentSearchChange = this.onDocumentSearchChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
    this.onOwnLeftClick = this.onOwnLeftClick.bind(this);
    this.onOwnRightClick = this.onOwnRightClick.bind(this);
    this.onOwnPageClick = this.onOwnPageClick.bind(this);
    this.onPublicLeftClick = this.onPublicLeftClick.bind(this);
    this.onPublicRightClick = this.onPublicRightClick.bind(this);
    this.onPublicPageClick = this.onPublicPageClick.bind(this);
    this.onPeopleLeftClick = this.onPeopleLeftClick.bind(this);
    this.onPeopleRightClick = this.onPeopleRightClick.bind(this);
    this.onPeoplePageClick = this.onPeoplePageClick.bind(this);
    this.unmountView = this.unmountView.bind(this);
  }

  /**
   * Runs when the Dashboard component has mounted
   * Initialize Materialize tooltip plugin
   * @returns {undefined}
   */
  componentDidMount() {
    $('.tooltipped').tooltip({ delay: 50 });
  }

  /**
   * Runs when the Dashboard component will receive new props
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { userSearch, documentSearch, allUsers, allDocuments } = nextProps;
    if (
    !$.isEmptyObject(documentSearch) &&
    this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.documents = documentSearch;
    } else {
      this.documents = allDocuments;
    }
    if (
    !$.isEmptyObject(userSearch) &&
    this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.users = userSearch;
    } else {
      this.users = allUsers;
    }
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
    this.setState({
      showOwnFeed: true,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false
    });
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
    this.setState({
      showOwnFeed: false,
      showAllFeed: true,
      showPeopleFeed: false,
      showSettingsFeed: false
    });
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
    this.setState({
      showOwnFeed: false,
      showAllFeed: false,
      showPeopleFeed: true,
      showSettingsFeed: false
    });
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
    this.setState({
      showOwnFeed: false,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: true
    });
  }

  /**
   * Change event handler for searching for documents
   * @param {Object} event The change event
   * @returns {undefined}
   */
  onDocumentSearchChange(event) {
    event.preventDefault();
    this.setState({ documentKeywords: event.target.value }, () => {
      if (this.state.documentKeywords.replace(/\s+/g, '') !== '') {
        this.props.searchDocuments(this.state.documentKeywords);
      } else {
        this.props.getAllDocuments();
      }
    });
  }

  /**
   * Change event handler for searching for users
   * @param {Object} event The change event
   * @returns {undefined}
   */
  onUserSearchChange(event) {
    event.preventDefault();
    this.setState({ userKeywords: event.target.value }, () => {
      if (this.state.userKeywords.replace(/\s+/g, '') !== '') {
        this.props.searchUsers(this.state.userKeywords);
      } else {
        this.props.getAllUsers();
      }
    });
  }

  /**
   * Click event handler for selecting a document
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onDocumentSelect(event) {
    event.preventDefault();
    this.setState({
      showMainView: true,
      showDocumentId: event.target.name || 'new',
      showProfileId: '',
      showSettings: false
    });
  }

  /**
   * Click event handler for selecting a user profile
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onProfileSelect(event) {
    event.preventDefault();
    this.setState({
      showMainView: true,
      showProfileId: event.target.name || this.props.ownId,
      showDocumentId: '',
      showSettings: false
    });
  }

  /**
   * Click event handler for selecting a settings option
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onSettingsSelect(event) {
    event.preventDefault();
    this.setState({
      showMainView: true,
      showSettings: true,
      showProfileId: '',
      showDocumentId: ''
    });
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onOwnLeftClick() {
    event.preventDefault();
    const { pageSize, currentPage } =
      this.props.users[this.props.ownId].documents.metadata;
    this.props.getUserDocuments(
      this.props.ownId,
      pageSize,
      (currentPage - 2) * pageSize);
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onOwnPageClick(event) {
    event.preventDefault();
    const { pageSize } =
      this.props.users[this.props.ownId].documents.metadata;
    this.props.getUserDocuments(
      this.props.ownId,
      pageSize,
      (event.target.name - 1) * pageSize);
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onOwnRightClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } =
      this.props.users[this.props.ownId].documents.metadata;
    this.props.getUserDocuments(
      this.props.ownId,
      pageSize,
      currentPage * pageSize);
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPublicLeftClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.documents.metadata;
    if (this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchDocuments(
        this.state.documentKeywords,
        pageSize,
        (currentPage - 2) * pageSize
      );
    } else {
      this.props.getAllDocuments(pageSize, (currentPage - 2) * pageSize);
    }
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPublicPageClick(event) {
    event.preventDefault();
    const { pageSize } = this.documents.metadata;
    if (this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchDocuments(
        this.state.documentKeywords,
        pageSize,
        (event.target.name - 1) * pageSize
      );
    } else {
      this.props.getAllDocuments(pageSize, (event.target.name - 1) * pageSize);
    }
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPublicRightClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.documents.metadata;
    if (this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchDocuments(
        this.state.documentKeywords,
        pageSize,
        currentPage * pageSize
      );
    } else {
      this.props.getAllDocuments(pageSize, currentPage * pageSize);
    }
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPeopleLeftClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.users.metadata;
    if (this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchUsers(
        this.state.userKeywords,
        pageSize,
        (currentPage - 2) * pageSize
      );
    } else {
      this.props.getAllUsers(pageSize, (currentPage - 2) * pageSize);
    }
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPeoplePageClick(event) {
    event.preventDefault();
    const { pageSize } = this.users.metadata;
    if (this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchUsers(
        this.state.userKeywords,
        pageSize,
        (event.target.name - 1) * pageSize
      );
    } else {
      this.props.getAllUsers(pageSize, (event.target.name - 1) * pageSize);
    }
  }

  /**
   * Click event handler for pagination
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onPeopleRightClick(event) {
    event.preventDefault();
    const { pageSize, currentPage } = this.users.metadata;
    if (this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.props.searchUsers(
        this.state.userKeywords,
        pageSize,
        currentPage * pageSize
      );
    } else {
      this.props.getAllUsers(pageSize, currentPage * pageSize);
    }
  }

  /**
   * Unmounts and closes main view
   * @returns {undefined}
   */
  unmountView() {
    this.setState({
      showDocumentId: '',
      showProfileId: '',
      showSettings: false,
      showMainView: false
    });
  }

  /**
   * Renders the Dashboard component
   * @returns {String} JSX markup for the Dashboard component
   */
  render() {
    return (
      <div className="dashboard-wrapper">
        <div className="row">
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
          <div className="col l3">
            <div className="card dashboard-panel side-panel">
              {this.state.showOwnFeed &&
                <div className="card-content side-view">
                  <span className="card-title">My Documents</span>
                  {(this.props.users[this.props.ownId] &&
                    this.props.users[this.props.ownId].documents)
                      ? <div className="own-feed">
                        <DocumentFeed
                          documents={this.props.users[this.props.ownId].documents}
                          documentClickAction={this.onDocumentSelect}
                          profileClickAction={this.onProfileSelect}
                        />
                        {this.props.users[this.props.ownId].documents.metadata &&
                          <Pagination
                            className="own-feed"
                            metadata={this.props.users[this.props.ownId]
                              .documents.metadata}
                            onLeftClick={this.onOwnLeftClick}
                            onRightClick={this.onOwnRightClick}
                            onPageClick={this.onOwnPageClick}
                          />}
                      </div>
                      : <Preloader className="middle" />}
                  </div>}
              {this.state.showAllFeed &&
                <div className="card-content side-view">
                  <span className="card-title">All Documents</span>
                  <div className="card search indigo darken-4 z-depth-4">
                    <div className="search-input">
                      <input
                        onChange={this.onDocumentSearchChange}
                        type="search"
                        placeholder="Search for a document"
                      />
                    </div>
                  </div>
                  {(!$.isEmptyObject(this.documents))
                    ? <div className="public-feed">
                      <DocumentFeed
                        documents={this.documents}
                        documentClickAction={this.onDocumentSelect}
                        profileClickAction={this.onProfileSelect}
                      />
                      {this.documents.metadata &&
                        <Pagination
                          className="public-feed"
                          metadata={this.documents.metadata}
                          onLeftClick={this.onPublicLeftClick}
                          onRightClick={this.onPublicRightClick}
                          onPageClick={this.onPublicPageClick}
                        />}
                    </div>
                    : <Preloader className="middle" />}
                </div>}
              {this.state.showPeopleFeed &&
                <div className="card-content side-view">
                  <span className="card-title">Other People</span>
                  <div className="card search indigo darken-4 z-depth-4">
                    <div className="search-input">
                      <input
                        onChange={this.onUserSearchChange}
                        type="search"
                        placeholder="Search for a user"
                      />
                    </div>
                  </div>
                  {(!$.isEmptyObject(this.users))
                    ? <div className="people-feed">
                      <UserFeed
                        users={this.users}
                        profileClickAction={this.onProfileSelect}
                      />
                      {this.users.metadata &&
                        <Pagination
                          className="people-feed"
                          metadata={this.users.metadata}
                          onLeftClick={this.onPeopleLeftClick}
                          onRightClick={this.onPeopleRightClick}
                          onPageClick={this.onPeoplePageClick}
                        />}
                    </div>
                    : <Preloader className="middle" />}
                </div>}
              {this.state.showSettingsFeed &&
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
          </div>
          <div className="col l8">
            {this.state.showMainView &&
              <div className="card dashboard-panel main-panel">
                {(this.state.showDocumentId) &&
                  <div className="main-view">
                    <DocumentView id={this.state.showDocumentId} close={this.unmountView} />
                  </div>}
                {(this.state.showProfileId) &&
                  <div className="main-view">
                    <ProfileView id={this.state.showProfileId} close={this.unmountView} />
                  </div>}
                {(this.state.showSettings) &&
                  <div className="main-view">
                    <SecurityPanel />
                  </div>}
                <a
                  className="btn-floating indigo darken-4 main-close z-depth-3"
                  onClick={this.unmountView}
                  role="button"
                >
                  <i className="material-icons">close</i>
                </a>
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.userReducer,
  allDocuments: state.documentReducer.all,
  allUsers: state.userReducer.all,
  documentSearch: state.documentReducer.search,
  userSearch: state.userReducer.search
});

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(getUser(id)),
  getUserDocuments: (id, limit, offset) =>
    dispatch(getUserDocuments(id, limit, offset)),
  getAllDocuments: (limit, offset) => dispatch(getAllDocuments(limit, offset)),
  searchDocuments: (query, limit, offset) =>
    dispatch(searchDocuments(query, limit, offset)),
  getAllUsers: (limit, offset) => dispatch(getAllUsers(limit, offset)),
  searchUsers: (query, limit, offset) =>
    dispatch(searchUsers(query, limit, offset))
});

Dashboard.propTypes = {
  ownId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  allUsers: PropTypes.object,
  allDocuments: PropTypes.object,
  userSearch: PropTypes.object,
  documentSearch: PropTypes.object,
  getUser: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired
};

Dashboard.defaultProps = {
  allUsers: {},
  allDocuments: {},
  userSearch: {},
  documentSearch: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
