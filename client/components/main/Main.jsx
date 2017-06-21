import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Desktop, Small, Mobile } from '../../utils/responsive';
import SinglePageView from './SinglePageView';
import MobileView from './MobileView';
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
 * Main application component
 * Renders as a mobile-optimized or single-page view for large screens
 * @author Princess-Jewel Essien
 */
class Main extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.props.getUser(this.props.ownId);
    this.state = {
      showFeeds: true,
      showOwnFeed: true,
      showAllFeed: false,
      showPeopleFeed: false,
      showSettingsFeed: false,
      showDocumentId: '',
      showProfileId: '',
      showSettings: false,
      documentKeywords: '',
      userKeywords: '',
      documents: this.props.allDocuments,
      users: this.props.allUsers
    };
    this.loadOwnDocuments = this.props.getUserDocuments.bind(null, this.props.ownId);
    this.changeView = this.changeView.bind(this);
    this.changeFeedView = this.changeFeedView.bind(this);
    this.onDocumentSearchChange = this.onDocumentSearchChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
    this.loadOwnDocuments();
  }

  /**
   * Runs when the Main component will receive new props
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { userSearch, documentSearch, allUsers, allDocuments } = nextProps;
    if (
    !$.isEmptyObject(documentSearch) &&
    this.state.documentKeywords.replace(/\s+/g, '') !== '') {
      this.setState({
        documents: documentSearch
      });
    } else {
      this.setState({
        documents: allDocuments
      });
    }
    if (
    !$.isEmptyObject(userSearch) &&
    this.state.userKeywords.replace(/\s+/g, '') !== '') {
      this.setState({
        users: userSearch
      });
    } else {
      this.setState({
        users: allUsers
      });
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
   * Switches the main view
   * @param {String} selectedView The view to change to
   * @param {*} value The value (usually ID) for the view
   * @returns {undefined}
   */
  changeView(selectedView, value) {
    this.setState({
      showDocumentId: '',
      showProfileId: '',
      showSettings: false
    }, () => {
      if (selectedView && value) {
        this.setState({ [selectedView]: value });
        this.setState({ showFeeds: false });
      } else {
        this.setState({ showFeeds: true });
      }
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
      this.setState({ showFeeds: true });
    });
  }

  /**
   * Renders the main app optimized for different screen sizes
   * @returns {String} The JSX markup for the component
   */
  render() {
    return (
      <div className="main-wrapper">
        <Desktop>
          <SinglePageView
            {...this.props}
            {...this.state}
            loadOwnDocuments={this.loadOwnDocuments}
            onDocumentSearchChange={this.onDocumentSearchChange}
            onUserSearchChange={this.onUserSearchChange}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Desktop>
        <Small>
          <MobileView
            {...this.props}
            {...this.state}
            loadOwnDocuments={this.loadOwnDocuments}
            onDocumentSearchChange={this.onDocumentSearchChange}
            onUserSearchChange={this.onUserSearchChange}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Small>
        <Mobile>
          <MobileView
            {...this.props}
            {...this.state}
            loadOwnDocuments={this.loadOwnDocuments}
            onDocumentSearchChange={this.onDocumentSearchChange}
            onUserSearchChange={this.onUserSearchChange}
            changeView={this.changeView}
            changeFeedView={this.changeFeedView}
          />
        </Mobile>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  self: state.userReducer[ownProps.ownId],
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

Main.propTypes = {
  ownId: PropTypes.string.isRequired,
  allUsers: PropTypes.object,
  allDocuments: PropTypes.object,
  userSearch: PropTypes.object,
  documentSearch: PropTypes.object,
  getUser: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired,
};

Main.defaultProps = {
  allUsers: {},
  allDocuments: {},
  userSearch: {},
  documentSearch: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main };
