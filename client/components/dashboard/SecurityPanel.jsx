import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfirmDialog from '../common/ConfirmDialog';
import { updateUser } from '../../actions/userActions';

/**
 * Panel for security-related actions
 * @author Princess-Jewel Essien
 */
class SecurityPanel extends Component {
  /**
   * Constructor for the SecurityPanel component
   * Sets password change form state
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: ''
    };
    this.onChange = this.onChange.bind(this);
    this.confirmChange = this.confirmChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.clearPasswordChanges = this.clearPasswordChanges.bind(this);
  }

  /**
   * Runs when the SecurityPanel component's props have changed'
   * Displays success/error messages and resets form fields
   * @param {Object} nextProps The new props for the component
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { ownId, users } = nextProps;
    if (users[ownId]) {
      if (users[ownId].error) {
        Materialize.toast(users[ownId].error.message, 3000,
        'indigo darken-4 white-text rounded');
      } else {
        Materialize.toast('Changed password successfully!', 3000,
        'indigo darken-4 white-text rounded');
      }
      this.clearPasswordChanges();
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
  confirmChange(event) {
    event.preventDefault();
    try {
      if (this.state.password.replace(/\s+/g, '') === '') {
        throw new Error('No field should be left blank');
      }
      if (this.state.password.length < 8) {
        throw new Error('Please choose a longer password');
      }
      if (this.state.password !== this.state.confirmPassword) {
        throw new Error('Passwords don\'t match!');
      }
      $('#confirm-change-password').modal('open');
    } catch (err) {
      Materialize.toast(err.message, 3000,
        'indigo darken-4 white-text rounded');
    }
  }

  /**
   * Method that makes request to change password
   * @returns {undefined}
   */
  changePassword() {
    this.props.updateUser(this.props.ownId, { password: this.state.password });
  }

  /**
   * Method that resets password change fields
   * @returns {undefined}
   */
  clearPasswordChanges() {
    this.setState({
      password: '',
      confirmPassword: ''
    });
  }

  /**
   * Renders the SecurityPanel component
   * @returns {String} JSX markup for the SecurityPanel component
   */
  render() {
    return (
      <div className="view-wrapper security">
        <span className="card-title">Security</span>
        <div className="password-change">
          <h5>Change your password:</h5>
          <form>
            <div className="input-field">
              <input
                value={this.state.password}
                onChange={this.onChange}
                name="password"
                type="password"
                className="validate"
                required
                id="new-password"
              />
              <label htmlFor="new-password">Password (at least 8 characters)</label>
            </div>
            <div className="input-field">
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
            <a className="btn indigo darken-4" href="#!" onClick={this.confirmChange}>Change</a>
          </form>
        </div>
        <ConfirmDialog
          id="confirm-change-password"
          message="Are you sure you want to change your password?"
          onYesClick={this.changePassword}
          onNoClick={this.clearPasswordChanges}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ownId: state.authReducer.currentUser,
  users: state.userReducer
});

const mapDispatchToProps = dispatch => ({
  updateUser: (id, patch) => dispatch(updateUser(id, patch))
});

SecurityPanel.propTypes = {
  ownId: PropTypes.string.isRequired,
  updateUser: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityPanel);
