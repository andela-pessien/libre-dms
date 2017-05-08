import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Wrapper that prevents unauthenticated access to resources
 * @param {Object} RestrictedComponent The resource requiring authentication
 * @param {Object} FallbackComponent Optional alternate component to be rendered
 * @returns {Object} Component that renders the resource or fallback
 */
function requireAuth(RestrictedComponent, FallbackComponent) {
  /**
   * Wrapping component for resources that require authentication
   * @author Princess-Jewel Essien
   */
  class AuthenticationCheck extends Component {
    /**
     * Renders the resource, its fallback, or nothing.
     * @returns {String} The component to be rendered
     */
    render() {
      if (this.props.isAuthenticated && this.props.user) {
        return (<RestrictedComponent {...this.props} />);
      } else if (FallbackComponent) {
        return (<FallbackComponent {...this.props} />);
      }
      return null;
    }
  }

  const mapStoreToProps = state => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    user: state.authReducer.user
  });

  AuthenticationCheck.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  };

  return connect(mapStoreToProps)(AuthenticationCheck);
}

export default requireAuth;
