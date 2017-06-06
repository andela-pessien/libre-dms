import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentFeed from '../document/DocumentFeed';
import UserFeed from '../user/UserFeed';
import Preloader from '../common/Preloader';
import ProfileView from '../user/ProfileView';
import DocumentView from '../document/DocumentView';
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
      showDocumentId: '',
      showProfileId: '',
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
    this.onDocumentSearchChange = this.onDocumentSearchChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
    nextProps.documentSearch &&
    this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.documents = nextProps.documentSearch;
    } else {
      this.documents = nextProps.allDocuments;
    }
    if (
    nextProps.userSearch &&
    this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.users = nextProps.userSearch;
    } else {
      this.users = nextProps.allUsers;
    }
  }

  onOwnDocumentsClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#own-documents-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.own-documents').removeClass('hidden');
    this.props.getUserDocuments(this.props.ownId);
  }

  onPublicButtonClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#public-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.public').removeClass('hidden');
    this.props.getAllDocuments();
  }

  onPeopleButtonClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#people-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.people').removeClass('hidden');
    this.props.getAllUsers();
  }

  onSettingsButtonClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#settings-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.settings').removeClass('hidden');
  }

  onDocumentSearchChange(e) {
    this.setState({ documentKeywords: e.target.value }, () => {
      if (this.state.documentKeywords.replace(/\s+/g, '') !== '') {
        this.props.searchDocuments(this.state.documentKeywords);
      } else {
        this.props.getAllDocuments();
      }
    });
  }

  onUserSearchChange(e) {
    this.setState({ userKeywords: e.target.value }, () => {
      if (this.state.userKeywords.replace(/\s+/g, '') !== '') {
        this.props.searchUsers(this.state.userKeywords);
      } else {
        this.props.getAllUsers();
      }
    });
  }

  onDocumentSelect(e) {
    $('.main-view').addClass('hidden');
    $('.show-document').removeClass('hidden');
    this.setState({ showDocumentId: e.target.name || 'new' });
  }

  onProfileSelect(e) {
    e.preventDefault();
    $('.main-view').addClass('hidden');
    $('.show-profile').removeClass('hidden');
    this.setState({ showProfileId: e.target.name || this.props.ownId });
  }

  onSettingsSelect() {
    $('.main-view').addClass('hidden');
    $('.show-settings').removeClass('hidden');
  }

  render() {
    return (
      <div className="dashboard-wrapper">
        <div className="fixed-side-menu">
          <div
            id="own-documents-button"
            className="fixed-side-menu-item active"
            onClick={this.onOwnDocumentsClick}
          >
            <i className="material-icons">insert_drive_file</i>
          </div>
          <div
            id="public-button"
            className="fixed-side-menu-item"
            onClick={this.onPublicButtonClick}
          >
            <i className="material-icons">public</i>
          </div>
          <div
            id="people-button"
            className="fixed-side-menu-item"
            onClick={this.onPeopleButtonClick}
          >
            <i className="material-icons">people</i>
          </div>
          <div
            id="settings-button"
            className="fixed-side-menu-item"
            onClick={this.onSettingsButtonClick}
          >
            <i className="material-icons">settings</i>
          </div>
        </div>
        <div className="row">
          <div className="col l4">
            <div className="card dashboard-panel side-panel">
              <div className="card-content side-view own-documents">
                <span className="card-title">My Documents</span>
                {(this.props.users[this.props.ownId] &&
                this.props.users[this.props.ownId].documents)
                  ? <DocumentFeed
                    documents={this.props.users[this.props.ownId].documents}
                    documentClickAction={this.onDocumentSelect}
                    profileClickAction={this.onProfileSelect}
                  />
                  : <Preloader className="middle" />}
              </div>
              <div className="card-content side-view public hidden">
                <span className="card-title">{"Others' Documents"}</span>
                <div className="card search indigo darken-4 z-depth-4">
                  <div className="search-input">
                    <input
                      onChange={this.onDocumentSearchChange}
                      type="search"
                      placeholder="Search for a document"
                    />
                  </div>
                </div>
                {(this.documents)
                  ? <DocumentFeed
                    documents={this.documents}
                    documentClickAction={this.onDocumentSelect}
                    profileClickAction={this.onProfileSelect}
                  />
                  : <Preloader className="middle" />}
              </div>
              <div className="card-content side-view people hidden">
                <span className="card-title">Other users</span>
                <div className="card search indigo darken-4 z-depth-4">
                  <div className="search-input">
                    <input
                      onChange={this.onUserSearchChange}
                      type="search"
                      placeholder="Search for a user"
                    />
                  </div>
                </div>
                {(this.users)
                  ? <UserFeed
                    users={this.users}
                    profileClickAction={this.onProfileSelect}
                  />
                  : <Preloader className="middle" />}
              </div>
              <div className="card-content side-view settings hidden">
                <span className="card-title">Settings</span>
                <ul>
                  <li>
                    <h5>
                      <a href="#!" onClick={this.onProfileSelect}>My Profile</a>
                    </h5>
                  </li>
                </ul>
              </div>
              <a
                className="btn-floating btn-large new-doc z-depth-4"
                onClick={this.onDocumentSelect}
              >
                <i className="material-icons">add</i>
              </a>
            </div>
          </div>
          <div className="col l8">
            <div className="card dashboard-panel main-panel">
              <div className="main-view show-document hidden">
                {(this.state.showDocumentId) && <DocumentView id={this.state.showDocumentId} />}
              </div>
              <div className="main-view show-profile hidden">
                {(this.state.showProfileId) && <ProfileView id={this.state.showProfileId} />}
              </div>
            </div>
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
  getUserDocuments: id => dispatch(getUserDocuments(id)),
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
  allDocuments: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
