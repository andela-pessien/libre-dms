import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { signUpAction } from '../../actions/authActions';

/**
 * Signup form component
 * @author Princess-Jewel Essien
 */
class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.target = props.target || '/';
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      console.log(nextProps.user);
      browserHistory.push(this.target);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      this.props.signUp(this.state);
    } else {
      Materialize.toast('Passwords don\'t match!', 3000);
    }
  }

  /**
   * Renders the SignUpForm component.
   * @returns {String} - HTML markup for SignUpForm component
   */
  render() {
    return (
      <form className="auth-form" onSubmit={this.onSubmit}>
        <div className="input-field left-align">
          <input
            value={this.state.name}
            onChange={this.onChange}
            id="signup-name"
            name="name"
            type="text"
            className="validate"
            required
          />
          <label htmlFor="signup-name">Name</label>
        </div>
        <div className="input-field left-align">
          <input
            value={this.state.email}
            onChange={this.onChange}
            id="signup-email"
            name="email"
            type="email"
            className="validate"
            required
          />
          <label htmlFor="signup-email">Email</label>
        </div>
        <div className="input-field left-align">
          <input
            value={this.state.password}
            onChange={this.onChange}
            id="signup-password"
            name="password"
            type="password"
            className="validate"
            required
          />
          <label htmlFor="signup-password">Password</label>
        </div>
        <div className="input-field left-align">
          <input
            value={this.state.confirmPassword}
            onChange={this.onChange}
            id="confirm-password"
            name="confirmPassword"
            type="password"
            className="validate"
            required
          />
          <label htmlFor="confirm-password">Confirm password</label>
        </div>
        <div className="center">
          <button className="btn indigo darken-4" type="submit">Sign Up</button>
        </div>
      </form>
    );
  }
}

const mapStoreToProps = (state) => {
  return {
    user: state.authReducer.user,
    error: state.authReducer.signUpError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: userData => dispatch(signUpAction(userData))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(SignUpForm);
