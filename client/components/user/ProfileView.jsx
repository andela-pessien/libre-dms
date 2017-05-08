import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Preloader from '../common/Preloader';
import UserDetails from './UserDetails';
import DocumentFeed from '../feeds/DocumentFeed';
import { getUser, getUserDocuments } from '../../actions/userActions';
import { getCurrentUserId } from '../../utils/currentUser';

/**
 * Component that displays a user's profile.
 * @author Princess-Jewel Essien
 */
class ProfileView extends Component {
  /**
   * Runs when the ProfileView component is about to mount.
   * Dispatches an action to get the user that corresponds to the passed ID
   * prop.
   * @returns {undefined}
   */
  componentWillMount() {
    const id = this.props.id || getCurrentUserId();
    this.props.getUser(id);
    if (this.props.full) {
      this.props.getUserDocuments(id);
    }
  }

  /**
   * Runs when the ProfileView's props have changed.
   * Redirects to the specified target if user has been deleted.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (!nextProps.container) {
      browserHistory.push(this.props.deleteTarget);
    }
  }

  /**
   * Renders the DocumentView component.
   * @returns {String} The HTML markup for the DocumentView component.
   */
  render() {
    return (
      <div className="view-wrapper z-index-3">
        {(this.props.container.user)
          ? (this.props.full)
            ? <div className="row user-details-side">
              <div className="col l5">
                <UserDetails user={this.props.container.user} />
              </div>
              <div className="col l7">
                {(this.props.container.documents)
                  ? <DocumentFeed documents={this.props.container.documents} />
                  : <Preloader className="middle" />}
              </div>
            </div>
            : <UserDetails user={this.props.container.user} />
          : <Preloader className="middle" />}
      </div>
    );
  }
}

const mapStoreToProps = (state, ownProps) => {
  const id = ownProps.id || getCurrentUserId();
  return {
    container: state.userReducer.users[id]
  };
};

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(getUser(id)),
  getUserDocuments: id => dispatch(getUserDocuments(id))
});

ProfileView.propTypes = {
  id: PropTypes.string.isRequired,
  full: PropTypes.bool,
  deleteTarget: PropTypes.string,
  container: PropTypes.shape({
    user: PropTypes.object,
    error: PropTypes.string,
    documents: PropTypes.arrayOf(PropTypes.object)
  }),
  getUser: PropTypes.func.isRequired
};

ProfileView.defaultProps = {
  deleteTarget: '/',
  container: {},
  full: false
};

export default connect(mapStoreToProps, mapDispatchToProps)(ProfileView);
