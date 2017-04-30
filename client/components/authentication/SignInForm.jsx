import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { signInAction } from '../../actions/authActions';

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.target = props.target || '/';
    this.state = {
      email: '',
      password: '',
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
    this.props.signIn(this.state);
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
            id="login-email"
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
            id="login-password"
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

const mapStoreToProps = (state) => {
  return {
    user: state.authReducer.user,
    error: state.authReducer.signInError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: userData => dispatch(signInAction(userData))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(SignInForm);
