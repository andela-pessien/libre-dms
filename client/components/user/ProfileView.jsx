import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Preloader from '../common/Preloader';
import UserDetails from './UserDetails';
import { getUser } from '../../actions/userActions';

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
  }

  /**
   * Runs when the ProfileView's props have changed.
   * Closes the view if user has been deleted.
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id && $.isEmptyObject(nextProps.container)) {
      this.props.close();
    }
    if (nextProps.id && nextProps.id !== this.props.id) {
      this.props.getUser(nextProps.id);
    }
  }

  /**
   * Renders the DocumentView component.
   * @returns {String} The HTML markup for the DocumentView component.
   */
  render() {
    return (
      <div className="view-wrapper profile-wrapper z-index-3">
        {(this.props.container.user) && <UserDetails id={this.props.id} />}
        {(!this.props.container.user &&
          !this.props.container.error) &&
          <Preloader classNames="middle" />}
        {(!this.props.container.user &&
          this.props.container.error) &&
          <h5 className="middle">{this.props.container.error.message}</h5>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  container: state.userReducer[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  getUser: id => dispatch(getUser(id))
});

ProfileView.propTypes = {
  id: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  container: PropTypes.shape({
    user: PropTypes.object,
    error: PropTypes.shape({
      message: PropTypes.string
    }),
    documents: PropTypes.object
  }),
  getUser: PropTypes.func.isRequired
};

ProfileView.defaultProps = {
  container: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
