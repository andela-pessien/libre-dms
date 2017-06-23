import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfirmDialog from '../common/ConfirmDialog';
import { updateUser, deleteUser, setUserRole } from '../../actions/userActions';
import parseDate from '../../utils/chronology';
import { isValidEmail, isValidName } from '../../utils/validate';
import {
  isSuperAdmin,
  isAdminOrHigher,
  roles,
  getRole
} from '../../utils/roles';

/**
 * Responsive layout handler
 * @returns {undefined}
 */
const setElementSizes = () => {
  const container = $('.user-details');
  const header = $('.header-photo');
  const avatar = $('.profile-photo');
  const icon = $('.profile-photo > i');
  const tableContainer = $('.details-body');
  header.css('height', container.height() / 3);
  tableContainer.css('height', container.height() - header.height());
  avatar.css({
    width: 0.75 * header.height(),
    height: 0.75 * header.height()
  });
  icon.css({
    'font-size': 0.75 * avatar.height(),
    padding: '12.5%'
  });
  $('tr').css('height', 0.2 * tableContainer.height());
};

/**
 * Click event handler for editing user details
 * @returns {undefined}
 */
const onEditClick = () => {
  $('#profile-edit-button').addClass('disabled');
  $('#profile-clear-button').removeClass('disabled');
  $('#profile-save-button').removeClass('disabled');
  $('td > input').prop('disabled', false);
  $('td > select').prop('disabled', false);
};

/**
 * Click event handler for editing user role
 * @returns {undefined}
 */
const onRoleEditClick = () => {
  $('#role-edit-button').addClass('disabled');
  $('#role-clear-button').removeClass('disabled');
  $('td > select').prop('disabled', false);
};

/**
 * Click event handler for deleting self
 * @returns {undefined}
 */
const onDeleteSelfClick = () => {
  $('#confirm-delete-self').modal('open');
};

/**
 * Click event handler for deleting other users
 * @returns {undefined}
 */
const onDeleteUserClick = () => {
  $('#confirm-delete-user').modal('open');
};

/**
 * Method that sets read only element visibility
 * @returns {undefined}
 */
const setReadonly = () => {
  $('#profile-edit-button').removeClass('disabled');
  $('#profile-clear-button').addClass('disabled');
  $('#profile-save-button').addClass('disabled');
  $('td > input').prop('disabled', true);
  $('td > select').prop('disabled', true);
};

/**
 * Component that displays a user's details
 * @author Princess-Jewel Essien
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
    setElementSizes();
    $(window).resize(() => {
      setElementSizes();
    });
  }

  /**
   * Runs when the UserDetails component will receive new props
   * @param {Object} nextProps The props to be received
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const userContainer = nextProps.users[this.props.id];
    if (userContainer && userContainer.error) {
      Materialize.toast(userContainer.error.message, 3000,
        'indigo darken-4 white-text rounded');
    }
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
   * @param {Object} event The change event
   * @returns {undefined}
   */
  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
    if (event.target.id === 'isPrivate') {
      this.setState({ [event.target.id]: !event.target.value });
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
   * Click event handler for clearing edits
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onClearClick() {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.setState({
      name: this.user.name,
      email: this.user.email,
      isPrivate: this.user.isPrivate
    });
    setReadonly();
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
   * @param {Object} event The click event
   * @returns {undefined}
   */
  onSaveClick() {
    try {
      const patch = {};
      if (this.state.name && this.state.name !== this.user.name) {
        if (!isValidName(this.state.name)) {
          throw new Error('Please provide a valid first and last name');
        }
        patch.name = this.state.name;
      }
      if (this.state.email && this.state.email !== this.user.email) {
        if (!isValidEmail(this.state.email)) {
          throw new Error('Please provide a valid email');
        }
        patch.email = this.state.email;
      }
      if (this.state.isPrivate !== this.user.isPrivate) {
        patch.isPrivate = this.state.isPrivate;
      }
      if (!$.isEmptyObject(patch)) {
        this.props.updateUser(this.user.id, patch);
      }
      $('.user-details > .fixed-action-btn').closeFAB();
      setReadonly();
    } catch (err) {
      Materialize.toast(err.message, 3000,
        'indigo darken-4 white-text rounded');
    }
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
            <a className="btn-floating btn-large indigo darken-4 z-depth-3">
              <i className="material-icons">menu</i>
            </a>
            <ul>
              <li>
                <a
                  id="profile-edit-button"
                  className="btn-floating indigo darken-4 z-depth-3"
                  onClick={onEditClick}
                  role="button"
                >
                  <i className="material-icons">edit</i>
                </a>
              </li>
              <li>
                <a
                  id="profile-save-button"
                  className="btn-floating indigo darken-4 z-depth-3 disabled"
                  onClick={this.onSaveClick}
                  role="button"
                >
                  <i className="material-icons">save</i>
                </a>
              </li>
              <li>
                <a
                  id="profile-clear-button"
                  className="btn-floating indigo darken-4 z-depth-3 disabled"
                  onClick={this.onClearClick}
                  role="button"
                >
                  <i className="material-icons">close</i>
                </a>
              </li>
              <li>
                <a
                  className="btn-floating indigo darken-4 z-depth-3"
                  onClick={onDeleteSelfClick}
                  role="button"
                >
                  <i className="material-icons">delete</i>
                </a>
              </li>
            </ul>
          </div>
          : (isAdminOrHigher(this.props.users[this.props.ownId].user)) &&
            <div className="fixed-action-btn horizontal click-to-toggle">
              <a className="btn-floating btn-large indigo darken-4 z-depth-3">
                <i className="material-icons">menu</i>
              </a>
              <ul>
                <li>
                  <a
                    id="role-edit-button"
                    className="btn-floating indigo darken-4 z-depth-3"
                    onClick={onRoleEditClick}
                    role="button"
                  >
                    <i className="material-icons">swap_vert</i>
                  </a>
                </li>
                <li>
                  <a
                    id="role-clear-button"
                    className="btn-floating indigo darken-4 z-depth-3 disabled"
                    onClick={this.onRoleClearClick}
                    role="button"
                  >
                    <i className="material-icons">close</i>
                  </a>
                </li>
                {(isSuperAdmin(this.props.users[this.props.ownId].user)) &&
                <li>
                  <a
                    className="btn-floating indigo darken-4 z-depth-3"
                    onClick={onDeleteUserClick}
                    role="button"
                  >
                    <i className="material-icons">delete</i>
                  </a>
                </li>}
              </ul>
            </div>}
        <div className="header-photo">
          <div className="profile-photo">
            <i className="material-icons">person</i>
          </div>
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
                      className="user-detail"
                      type="text"
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
                  {(this.props.id === this.props.ownId) &&
                    <select
                      id="isPrivate"
                      className="user-detail"
                      value={this.state.isPrivate ? '' : 'yes'}
                      onChange={this.onChange}
                      disabled
                    >
                      <option value="yes">Yes</option>
                      <option value="">No</option>
                    </select>}
                  {!(this.props.id === this.props.ownId) && (this.state.isPrivate ? 'No' : 'Yes')}
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
                        <option key={role} value={index + 2}>{role}</option>)}
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
        />
        <ConfirmDialog
          id="confirm-delete-self"
          message="Are you sure you want to delete your account?"
          onYesClick={this.deleteSelf}
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
