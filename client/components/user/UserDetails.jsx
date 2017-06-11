import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfirmDialog from '../common/ConfirmDialog';
import { updateUser, deleteUser, setUserRole } from '../../actions/userActions';
import parseDate from '../../utils/chronology';
import {
  isSuperAdmin,
  isAdminOrHigher,
  roles,
  getRole
} from '../../utils/roles';

/**
 * Component that displays a user's details
 * @author Princess-Jewel Essine
 */
class UserDetails extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.user = this.props.users[this.props.id].user;
    this.state = {
      name: this.user.name,
      email: this.user.email,
      isPrivate: this.user.isPrivate,
      userRole: this.user.roleId
    };
    this.onChange = this.onChange.bind(this);
    this.onRoleChange = this.onRoleChange.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
    this.onRoleClearClick = this.onRoleClearClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.setUserRole = this.setUserRole.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * Runs when the UserDetails component has mounted
   * @returns {undefined}
   */
  componentDidMount() {
    const header = $('.header-photo');
    const avatar = $('.profile-photo');
    header.css('height', header.width() / 3);
    avatar.css({
      width: 0.2 * header.width(),
      height: 0.2 * header.width()
    });
    avatar.css('font-size', 0.75 * avatar.height());
  }

  /**
   * Runs when the UserDetails component will receive new props
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const userContainer = nextProps.users[this.props.id];
    if (userContainer && userContainer.user) {
      this.setState({
        name: userContainer.user.name,
        email: userContainer.user.email,
        isPrivate: userContainer.user.isPrivate,
        userRole: userContainer.user.roleId
      });
      this.user = nextProps.users[this.props.id].user;
    }
  }

  /**
   * Change event handler for editing user details
   * @param {Object} e The change event
   * @returns {undefined}
   */
  onChange(e) {
    this.setState({ [e.target.id]: e.target.value });
    if (e.target.id === 'isPrivate') {
      this.setState({ [e.target.id]: !e.target.value });
    }
  }

  /**
   * Change event handler for editing user role
   * @param {Object} event The change event
   * @returns {undefined}
   */
  onRoleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
    $('#confirm-change-role').modal('open');
  }

  /**
   * Click event handler for editing user details
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onEditClick(e) {
    $('#profile-edit-button').addClass('disabled');
    $('#profile-clear-button').removeClass('disabled');
    $('#profile-save-button').removeClass('disabled');
    $('td > input').prop('disabled', false);
    $('td > select').prop('disabled', false);
  }

  /**
   * Click event handler for editing user role
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onRoleEditClick(event) {
    $('#role-edit-button').addClass('disabled');
    $('#role-clear-button').removeClass('disabled');
    $('td > select').prop('disabled', false);
  }

  /**
   * Click event handler for clearing edits
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onClearClick() {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.setState({
      name: this.user.name,
      email: this.user.email,
      isPrivate: this.user.isPrivate
    });
    this.setReadonly();
  }

  /**
   * Click event handler for clearing role changes
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onRoleClearClick() {
    $('td > select').prop('disabled', true);
    $('#role-edit-button').removeClass('disabled');
    $('#role-clear-button').addClass('disabled');
    $('.user-details > .fixed-action-btn').closeFAB();
    this.setState({
      userRole: this.user.roleId
    });
  }

  /**
   * Click event handler for saving edited details
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onSaveClick() {
    $('.user-details > .fixed-action-btn').closeFAB();
    const patch = {};
    if (this.state.name && this.state.name !== this.user.name) {
      patch.name = this.state.name;
    }
    if (
    this.state.email &&
    $('#email').hasClass('valid') &&
    this.state.email !== this.user.email) {
      patch.email = this.state.email;
    }
    if (this.state.isPrivate !== this.user.isPrivate) {
      patch.isPrivate = this.state.isPrivate;
    }
    if (!$.isEmptyObject(patch)) {
      this.props.updateUser(this.user.id, patch);
    }
    this.setReadonly();
  }

  /**
   * Method that sets read only element visibility
   * @returns {undefined}
   */
  setReadonly() {
    $('#profile-edit-button').removeClass('disabled');
    $('#profile-clear-button').addClass('disabled');
    $('#profile-save-button').addClass('disabled');
    $('td > input').prop('disabled', true);
    $('td > select').prop('disabled', true);
  }

  /**
   * Method that dispatches request to change a user's role
   * @returns {undefined}
   */
  setUserRole() {
    $('td > select').prop('disabled', true);
    $('#role-edit-button').removeClass('disabled');
    $('#role-clear-button').addClass('disabled');
    $('.user-details > .fixed-action-btn').closeFAB();
    this.props.setUserRole(this.props.id, this.state.userRole);
  }

  /**
   * Deletes own account and signs out user
   * @returns {undefined}
   */
  deleteSelf() {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.props.deleteUser(this.user.id, true);
  }

  /**
   * Deletes own account and signs out user
   * @returns {undefined}
   */
  deleteUser() {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.props.deleteUser(this.user.id);
  }

  /**
   * Renders the UserDetails component
   * @returns {String} JSX markup for the UserDetails component
   */
  render() {
    return (
      this.user && <div className="user-details">
        {(this.props.id === this.props.ownId)
          ? <div className="fixed-action-btn horizontal click-to-toggle">
            <a className="btn-floating btn-large indigo darken-4">
              <i className="material-icons">menu</i>
            </a>
            <ul>
              <li>
                <a
                  id="profile-edit-button"
                  className="btn-floating indigo darken-4"
                  onClick={this.onEditClick}
                >
                  <i className="material-icons">edit</i>
                </a>
              </li>
              <li>
                <a
                  id="profile-save-button"
                  className="btn-floating indigo darken-4 disabled"
                  onClick={this.onSaveClick}
                >
                  <i className="material-icons">save</i>
                </a>
              </li>
              <li>
                <a
                  id="profile-clear-button"
                  className="btn-floating indigo darken-4 disabled"
                  onClick={this.onClearClick}
                >
                  <i className="material-icons">close</i>
                </a>
              </li>
              <li>
                <a
                  className="btn-floating indigo darken-4"
                  onClick={() => { $('#confirm-delete-self').modal('open'); }}
                >
                  <i className="material-icons">delete</i>
                </a>
              </li>
            </ul>
          </div>
          : (isAdminOrHigher(this.props.users[this.props.ownId].user)) &&
            <div className="fixed-action-btn horizontal click-to-toggle">
              <a className="btn-floating btn-large indigo darken-4">
                <i className="material-icons">menu</i>
              </a>
              <ul>
                <li>
                  <a
                    id="role-edit-button"
                    className="btn-floating indigo darken-4"
                    onClick={this.onRoleEditClick}
                  >
                    <i className="material-icons">swap_vert</i>
                  </a>
                </li>
                <li>
                  <a
                    id="role-clear-button"
                    className="btn-floating indigo darken-4 disabled"
                    onClick={this.onRoleClearClick}
                  >
                    <i className="material-icons">close</i>
                  </a>
                </li>
                {(isSuperAdmin(this.props.users[this.props.ownId].user)) &&
                <li>
                  <a
                    className="btn-floating indigo darken-4"
                    onClick={() => { $('#confirm-delete-user').modal('open'); }}
                  >
                    <i className="material-icons">delete</i>
                  </a>
                </li>}
              </ul>
            </div>}
        <div className="header-photo">
          <div className="profile-photo">{this.user.name[0]}</div>
        </div>
        <div className="details-body">
          <table className="striped">
            <tbody>
              <tr>
                <td className="center">Name</td>
                <td>
                  {(this.props.id === this.props.ownId)
                    ? <input
                      id="name"
                      className="user-detail"
                      type="text"
                      value={this.state.name}
                      onChange={this.onChange}
                      disabled
                    />
                    : this.state.name}
                </td>
              </tr>
              <tr>
                <td className="center">Email</td>
                <td>
                  {(this.props.id === this.props.ownId)
                    ? <input
                      id="email"
                      className="user-detail validate"
                      type="email"
                      value={this.state.email}
                      onChange={this.onChange}
                      disabled
                    />
                    : this.state.email}
                </td>
              </tr>
              <tr>
                <td className="center">Public profile</td>
                <td>
                  {(this.props.id === this.props.ownId)
                    ? <select
                      id="isPrivate"
                      className="user-detail"
                      value={this.state.isPrivate ? '' : 'yes'}
                      onChange={this.onChange}
                      disabled
                    >
                      <option value="yes">Yes</option>
                      <option value="">No</option>
                    </select>
                    : this.state.isPrivate ? 'No' : 'Yes'}
                </td>
              </tr>
              <tr>
                <td className="center">Role</td>
                <td>
                  {(this.props.id === this.props.ownId ||
                  !isAdminOrHigher(this.props.users[this.props.ownId].user) ||
                  (isAdminOrHigher(this.user) &&
                    !isSuperAdmin(this.props.users[this.props.ownId].user)))
                    ? getRole(this.user.roleId)
                    : <select
                      id="userRole"
                      className="user-detail"
                      value={this.state.userRole}
                      onChange={this.onRoleChange}
                      disabled
                    >
                      {roles.slice(1).map((role, index) =>
                        <option value={index + 2}>{role}</option>)}
                    </select>
                  }
                </td>
              </tr>
              <tr>
                <td className="center">User since</td>
                <td>{parseDate(this.user.createdAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ConfirmDialog
          id="confirm-delete-user"
          message="Are you sure you want to delete this user's account?"
          onYesClick={this.deleteUser}
          onNoClick={() => {}}
        />
        <ConfirmDialog
          id="confirm-delete-self"
          message="Are you sure you want to delete your account?"
          onYesClick={this.deleteSelf}
          onNoClick={() => {}}
        />
        <ConfirmDialog
          id="confirm-change-role"
          message={
            `Are you sure you want to change this user's role to ${getRole(this.state.userRole)}?`}
          onYesClick={this.setUserRole}
          onNoClick={this.onRoleClearClick}
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
  updateUser: (id, patch) => dispatch(updateUser(id, patch)),
  deleteUser: (id, isSelf) => dispatch(deleteUser(id, isSelf)),
  setUserRole: (id, roleId) => dispatch(setUserRole(id, roleId))
});

UserDetails.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  ownId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
