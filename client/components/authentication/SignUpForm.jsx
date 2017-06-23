import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signUp } from '../../actions/authActions';
import { isValidEmail, isValidName } from '../../utils/validate';

/**
 * Signup form component
 * @author Princess-Jewel Essien
 */
export class SignUpFormComponent extends Component {
  /**
   * Constructor for the signup form component
   * Sets form state
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Runs when the SignUpForm component's props have been updated
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error && error.message) {
      Materialize.toast(error.message, 3000,
        'indigo darken-4 white-text rounded');
    }
  }

  /**
   * Event listener for changes to form input
   * @param {Object} event The form change event
   * @returns {undefined}
   */
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Event listener for form submission
   * Performs validations before submission
   * @param {Object} event The form submission event
   * @returns {undefined}
   */
  onSubmit(event) {
    event.preventDefault();
    try {
      if (
      this.state.name.replace(/\s+/g, '') === '' ||
      this.state.email.replace(/\s+/g, '') === '' ||
      this.state.password.replace(/\s+/g, '') === '') {
        throw new Error('No field should be left blank');
      }
      if (!isValidEmail(this.state.email)) {
        throw new Error('Please provide a valid email');
      }
      if (!isValidName(this.state.name)) {
        throw new Error('Please provide a valid first and last name');
      }
      if (this.state.password.length < 8) {
        throw new Error('Please choose a longer password');
      }
      if (this.state.password !== this.state.confirmPassword) {
        throw new Error('Passwords don\'t match!');
      }
      this.props.signUp(this.state);
    } catch (err) {
      Materialize.toast(err.message, 3000,
        'indigo darken-4 white-text rounded');
    }
  }

  /**
   * Renders the SignUpForm component.
   * @returns {String} - HTML markup for SignUpForm component
   */
  render() {
    return (
      <form className="auth-form signup-form" onSubmit={this.onSubmit}>
        <div className="input-field form-field left-align">
          <input
            value={this.state.name}
            onChange={this.onChange}
            id="signup-name"
            name="name"
            type="text"
          />
          <label htmlFor="signup-name" className="form-label">Name (first and last only)</label>
        </div>
        <div className="input-field form-field left-align">
          <input
            value={this.state.email}
            onChange={this.onChange}
            id="signup-email"
            name="email"
            type="text"
          />
          <label htmlFor="signup-email" className="form-label">Email</label>
        </div>
        <div className="input-field form-field left-align">
          <input
            value={this.state.password}
            onChange={this.onChange}
            id="signup-password"
            name="password"
            type="password"
          />
          <label
            htmlFor="signup-password"
            className="form-label"
          >Password (at least 8 characters)</label>
        </div>
        <div className="input-field form-field left-align">
          <input
            value={this.state.confirmPassword}
            onChange={this.onChange}
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
          />
          <label htmlFor="confirm-password" className="form-label">Confirm password</label>
        </div>
        <div className="center">
          <button className="btn indigo darken-4 submit-signup" type="submit">Sign Up</button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.authReducer.signUpError
});

const mapDispatchToProps = dispatch => ({
  signUp: userData => dispatch(signUp(userData))
});

SignUpFormComponent.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  signUp: PropTypes.func.isRequired
};

SignUpFormComponent.defaultProps = {
  error: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFormComponent);
