import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from '../common/Navbar';
import DocumentFeed from '../feeds/DocumentFeed';
import Preloader from '../common/Preloader';
import ProfileView from '../user/ProfileView';
import DocumentView from '../document/DocumentView';
import { getUser, getUserDocuments } from '../../actions/userActions';
import { getAllDocuments } from '../../actions/documentActions';
import { getCurrentUserId } from '../../utils/currentUser';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.ownId = getCurrentUserId();
    this.props.getUser(this.ownId);
    this.props.getUserDocuments(this.ownId);
    this.state = {
      showDocumentId: '',
      showProfileId: ''
    };
    this.onOwnDocumentsClick = this.onOwnDocumentsClick.bind(this);
    this.onPublicButtonClick = this.onPublicButtonClick.bind(this);
    this.onSettingsButtonClick = this.onSettingsButtonClick.bind(this);
    this.onDocumentSelect = this.onDocumentSelect.bind(this);
    this.onProfileSelect = this.onProfileSelect.bind(this);
  }

  onOwnDocumentsClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#own-documents-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.own-documents').removeClass('hidden');
    this.props.getUserDocuments(this.ownId);
  }

  onPublicButtonClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#public-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.public').removeClass('hidden');
    this.props.getAllDocuments();
  }

  onSettingsButtonClick(e) {
    e.preventDefault();
    $('.fixed-side-menu-item').removeClass('active');
    $('#settings-button').addClass('active');
    $('.side-view').addClass('hidden');
    $('.settings').removeClass('hidden');
  }

  onDocumentSelect(e) {
    $('.main-view').addClass('hidden');
    $('.show-document').removeClass('hidden');
    this.setState({ showDocumentId: e.target.name || 'new' });
  }

  onProfileSelect(e) {
    $('.main-view').addClass('hidden');
    $('.show-profile').removeClass('hidden');
    this.setState({ showProfileId: e.target.name || this.ownId });
  }

  onSettingsSelect() {
    $('.main-view').addClass('hidden');
    $('.show-settings').removeClass('hidden');
  }

  render() {
    return (
      <div className="dashboard-wrapper">
        <Navbar />
        <div className="dashboard">
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
              id="settings-button"
              className="fixed-side-menu-item"
              onClick={this.onSettingsButtonClick}
            >
              <i className="material-icons">settings</i>
            </div>
          </div>
          <div className="row">
            <div className="col l4">
              <div className="card dashboard-panel">
                <div className="card-content side-view own-documents black-text">
                  <span className="card-title">My Documents</span>
                  {(this.props.users[this.ownId] &&
                  this.props.users[this.ownId].documents)
                    ? <DocumentFeed
                      documents={this.props.users[this.ownId].documents}
                      documentClickAction={this.onDocumentSelect}
                      profileClickAction={this.onProfileSelect}
                    />
                    : <Preloader className="middle" />}
                    <a
                      className="btn-floating btn-large indigo darken-4 home-new z-depth-4"
                      onClick={this.onDocumentSelect}
                    >
                      <i className="material-icons">add</i>
                    </a>
                </div>
                <div className="card-content side-view public black-text hidden">
                  <span className="card-title">{"Others' Documents"}</span>
                  {(this.props.allDocuments)
                    ? <DocumentFeed
                      documents={this.props.allDocuments}
                      documentClickAction={this.onDocumentSelect}
                      profileClickAction={this.onProfileSelect}
                    />
                    : <Preloader className="middle" />}
                </div>
                <div className="card-content side-view settings black-text hidden">
                  <span className="card-title">Settings</span>
                  <ul>
                    <li>
                      <a onClick={this.onProfileSelect}>My Profile</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col l8">
              <div className="card dashboard-panel">
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
      </div>
    );
  }
}

const mapStoreToProps = state => ({
  users: state.userReducer.users,
  allDocuments: state.documentReducer.allDocuments
});

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(getUser(id)),
  getUserDocuments: id => dispatch(getUserDocuments(id)),
  getAllDocuments: () => dispatch(getAllDocuments())
});

export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard);
