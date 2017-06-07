import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Preloader from '../common/Preloader';
import UserDetails from './UserDetails';
import DocumentFeed from '../document/DocumentFeed';
import { getUser, getUserDocuments } from '../../actions/userActions';

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
    this.props.getUser(this.props.id);
    if (this.props.full) {
      this.props.getUserDocuments(this.props.id);
    }
  }

  /**
   * Runs when the ProfileView's props have changed.
   * Redirects to the specified target if user has been deleted.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      this.props.getUser(nextProps.id);
      if (this.props.full) {
        this.props.getUserDocuments(nextProps.id);
      }
    }
  }

  /**
   * Renders the DocumentView component.
   * @returns {String} The HTML markup for the DocumentView component.
   */
  render() {
    return (
      <div className="view-wrapper profile-wrapper z-index-3">
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

const mapStateToProps = (state, ownProps) => ({
  container: state.userReducer[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(getUser(id)),
  getUserDocuments: id => dispatch(getUserDocuments(id))
});

ProfileView.propTypes = {
  id: PropTypes.string.isRequired,
  full: PropTypes.bool,
  container: PropTypes.shape({
    user: PropTypes.object,
    error: PropTypes.shape({
      message: PropTypes.string
    }),
    documents: PropTypes.object
  }),
  getUser: PropTypes.func.isRequired,
  getUserDocuments: PropTypes.func.isRequired
};

ProfileView.defaultProps = {
  deleteTarget: '/',
  container: {},
  full: false
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
