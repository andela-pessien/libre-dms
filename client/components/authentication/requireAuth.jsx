import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from '../../images/labeledlogo-white.png';

/**
 * Wrapper that prevents unauthenticated access to resources
 * @param {Object} RestrictedComponent The resource requiring authentication
 * @param {Object} FallbackComponent Optional alternate component to be rendered
 * @param {Boolean} wait Whether to wait for authentication or not
 * @returns {Object} Component that renders the resource or fallback
 */
function requireAuth(RestrictedComponent, FallbackComponent, wait) {
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
      if (this.props.isAuthenticated && this.props.ownId) {
        return (<RestrictedComponent {...this.props} />);
      } else if (wait && this.props.isAuthenticated) {
        return (
          <div className="logo-image-wrapper center" style={{ width: '50%' }}>
            <div className="logo-image">
              <img src={logo} alt="logo" />
            </div>
          </div>
        );
      } else if (FallbackComponent) {
        return (<FallbackComponent {...this.props} />);
      }
      return null;
    }
  }

  const mapStateToProps = state => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    ownId: state.authReducer.currentUser
  });

  AuthenticationCheck.propTypes = {
    isAuthenticated: PropTypes.bool,
    ownId: PropTypes.string
  };

  AuthenticationCheck.defaultProps = {
    isAuthenticated: false,
    ownId: ''
  };

  return connect(mapStateToProps)(AuthenticationCheck);
}

export default requireAuth;
