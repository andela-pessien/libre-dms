import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signIn } from '../../actions/authActions';

/**
 * Signin form component
 * @author Princess-Jewel Essien
 */
class SignInForm extends Component {
  /**
   * Constructor for the signin form component
   * Sets form state
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Runs when the SignInForm component's props have been updated
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error && error.message) {
      Materialize.toast(error.message, 3000, 'indigo darken-4 rounded');
    }
  }

  /**
   * Event listener for changes to form input
   * @param {Object} e The form change event
   * @returns {undefined}
   */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  /**
   * Event listener for form submission
   * Performs validations before submission
   * @param {Object} e The form submission event
   * @returns {undefined}
   */
  onSubmit(e) {
    e.preventDefault();
    try {
      if (
      this.state.email.replace(/\s+/g, '') === '' ||
      this.state.password.replace(/\s+/g, '') === '') {
        throw new Error('No field should be left blank');
      }
      if (!$('#signin-email').hasClass('valid')) {
        throw new Error('Please provide a valid email');
      }
      this.props.signIn(this.state);
    } catch (err) {
      Materialize.toast(err.message, 3000, 'indigo darken-4 rounded');
    }
  }

  /**
   * Renders the SignInForm component.
   * @returns {String} - HTML markup for SignInForm component
   */
  render() {
    return (
      <form className="auth-form" onSubmit={this.onSubmit}>
        <div className="input-field left-align">
          <input
            value={this.state.email}
            onChange={this.onChange}
            id="signin-email"
            name="email"
            type="email"
            className="validate"
            required
          />
          <label htmlFor="login-email">Email</label>
        </div>
        <div className="input-field left-align">
          <input
            value={this.state.password}
            onChange={this.onChange}
            id="signin-password"
            name="password"
            type="password"
            className="validate"
            required
          />
          <label htmlFor="login-password">Password</label>
        </div>
        <div className="center">
          <button className="btn indigo darken-4" type="submit">Sign In</button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  ownId: state.authReducer.currentUser,
  error: state.authReducer.signUpError
});

const mapDispatchToProps = dispatch => ({
  signIn: userData => dispatch(signIn(userData))
});

SignInForm.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  signIn: PropTypes.func.isRequired
};

SignInForm.defaultProps = {
  error: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
