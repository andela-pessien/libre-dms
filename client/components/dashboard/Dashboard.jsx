import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentFeed from '../document/DocumentFeed';
import UserFeed from '../user/UserFeed';
import Preloader from '../common/Preloader';
import Pagination from '../common/Pagination';
import ProfileView from '../user/ProfileView';
import DocumentView from '../document/DocumentView';
import SideMenu from './SideMenu';
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
    this.loadOwnDocuments = this.props.getUserDocuments.bind(null, this.props.ownId);
    this.onDocumentSelect = this.onDocumentSelect.bind(this);
    this.onProfileSelect = this.onProfileSelect.bind(this);
    this.onSettingsSelect = this.onSettingsSelect.bind(this);
    this.onDocumentSearchChange = this.onDocumentSearchChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
    this.changeFeedView = this.changeFeedView.bind(this);
    this.unmountView = this.unmountView.bind(this);
    this.loadOwnDocuments();
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
   * Switches the feed view.
   * @param {String} selectedView The view to change to
   * @returns {undefined}
   */
  changeFeedView(selectedView) {
    this.setState({
      showOwnFeed: false,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false
    }, () => {
      this.setState({ [selectedView]: true });
    });
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
          <SideMenu
            ownId={this.props.ownId}
            changeFeedView={this.changeFeedView}
            getUserDocuments={this.props.getUserDocuments}
            getAllDocuments={this.props.getAllDocuments}
            getAllUsers={this.props.getAllUsers}
          />
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
                            metadata={this.props.users[this.props.ownId]
                              .documents.metadata}
                            loadList={this.loadOwnDocuments}
                          />}
                      </div>
                      : (!this.props.users[this.props.ownId].error &&
                        <Preloader classNames="middle" />)}
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
                  <div className="public-feed">
                    <DocumentFeed
                      documents={this.documents}
                      documentClickAction={this.onDocumentSelect}
                      profileClickAction={this.onProfileSelect}
                    />
                    {this.documents.metadata &&
                      <Pagination
                        metadata={this.documents.metadata}
                        loadList={
                          this.state.documentKeywords
                            ? this.props.searchDocuments.bind(
                                null,
                                this.state.documentKeywords
                              )
                            : this.props.getAllDocuments
                          }
                      />}
                  </div>
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
                  <div className="people-feed">
                    <UserFeed
                      users={this.users}
                      profileClickAction={this.onProfileSelect}
                    />
                    {this.users.metadata &&
                      <Pagination
                        metadata={this.users.metadata}
                        loadList={
                          this.state.userKeywords
                            ? this.props.searchUsers.bind(
                                null,
                                this.state.userKeywords
                              )
                            : this.props.getAllUsers
                          }
                      />}
                  </div>
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
