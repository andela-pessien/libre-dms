import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUser, deleteUser } from '../../actions/userActions';
import parseDate from '../../utils/chronology';
import {
  isSuperAdmin,
  isAdminOrHigher,
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
    this.user = this.props.users[this.props.id];
    this.state = {
      name: this.user.name,
      email: this.user.email,
      isPrivate: this.user.isPrivate
    };
    this.onChange = this.onChange.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
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
    if (nextProps.users[this.id]) {
      this.setState({
        name: nextProps.users[this.id].name,
        email: nextProps.users[this.id].email
      });
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
   * Click event handler for editing user details
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onEditClick(e) {
    $('#profile-edit-button').addClass('disabled');
    $('#profile-clear-button').removeClass('disabled');
    $('#profile-save-button').removeClass('disabled');
    $('td > input').prop('disabled', false);
    $('select').prop('disabled', false);
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
   * Click event handler for deleting a user
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onDeleteClick(e) {
    $('.user-details > .fixed-action-btn').closeFAB();
    if (e.target.name === 'self') {
      this.props.deleteUser(this.user.id, true);
    } else {
      this.props.deleteUser(this.user.id);
    }
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
    $('select').prop('disabled', true);
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
                  name="self"
                  onClick={this.onDeleteClick}
                >
                  <i className="material-icons">delete</i>
                </a>
              </li>
            </ul>
          </div>
          : (isAdminOrHigher(this.props.users[this.props.ownId])) &&
            <div className="fixed-action-btn horizontal click-to-toggle">
              <a className="btn-floating btn-large indigo darken-4">
                <i className="material-icons">menu</i>
              </a>
              <ul>
                <li>
                  <a
                    className="btn-floating indigo darken-4"
                    onClick={this.onDeleteClick}
                  >
                    <i className="material-icons">delete</i>
                  </a>
                </li>
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
                  <input
                    id="name"
                    className="user-detail"
                    type="text"
                    value={this.state.name}
                    onChange={this.onChange}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="center">Email</td>
                <td>
                  <input
                    id="email"
                    className="user-detail validate"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="center">Public profile</td>
                <td>
                  <select
                    id="isPrivate"
                    className="user-detail"
                    value={this.state.isPrivate ? '' : 'yes'}
                    onChange={this.onChange}
                    disabled
                  >
                    <option value="yes">Yes</option>
                    <option value="">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="center">Role</td>
                <td>{getRole(this.user.roleId)}</td>
              </tr>
              <tr>
                <td className="center">User since</td>
                <td>{parseDate(this.user.createdAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
  deleteUser: (id, isSelf) => dispatch(deleteUser(id, isSelf))
});

UserDetails.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  ownId: PropTypes.string.isRequired,
  id: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
