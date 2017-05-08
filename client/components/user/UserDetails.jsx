import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUser, deleteUser } from '../../actions/userActions';
import { getCurrentUserId } from '../../utils/currentUser';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      email: this.props.user.email
    };
    this.onChange = this.onChange.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  componentDidMount() {
    const header = $('.header-photo');
    const avatar = $('.profile-photo');
    header.css('height', header.width() / 3);
    avatar.css('width', 0.2 * header.width());
    avatar.css('height', 0.2 * header.width());
  }

  onChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  onEditClick(e) {
    $('.user-details > .fixed-action-btn').closeFAB();
    $('#profile-edit-button').addClass('disabled');
    $('#profile-clear-button').removeClass('disabled');
    $('#profile-save-button').removeClass('disabled');
    $('td > input').prop('disabled', false);
  }

  onClearClick(e) {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email
    });
    this.setReadonly();
  }

  onSaveClick(e) {
    $('.user-details > .fixed-action-btn').closeFAB();
    const patch = {};
    if (this.state.name && this.state.name !== this.props.user.name) {
      patch.name = this.state.name;
    }
    if (
    this.state.email &&
    $('#email').hasClass('valid') &&
    this.state.email !== this.props.user.email) {
      patch.email = this.state.email;
    }
    if (!$.isEmptyObject(patch)) {
      this.props.updateUser(this.props.user.id, patch);
    }
    this.setReadonly();
  }

  onDeleteClick(e) {
    $('.user-details > .fixed-action-btn').closeFAB();
    this.props.deleteUser(this.props.user.id);
  }

  setReadonly() {
    $('#profile-edit-button').removeClass('disabled');
    $('#profile-clear-button').addClass('disabled');
    $('#profile-save-button').addClass('disabled');
    $('td > input').prop('disabled', true);
  }

  render() {
    return (
      <div className="user-details">
        {(this.props.user.id === getCurrentUserId())
          && <div className="fixed-action-btn horizontal click-to-toggle">
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
                  onClick={this.onDeleteClick}
                >
                  <i className="material-icons">delete</i>
                </a>
              </li>
            </ul>
          </div>}
        <div className="header-photo">
          <div className="profile-photo" />
        </div>
        <div className="details-body">
          <table className="centered">
            <tbody>
              <tr>
                <td>Name</td>
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
                <td>Email</td>
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
                <td>Role</td>
                <td>{this.props.user.roleId}</td>
              </tr>
              <tr>
                <td>User since</td>
                <td>{this.props.user.createdAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateUser: (id, patch) => dispatch(updateUser(id, patch)),
  deleteUser: id => dispatch(deleteUser(id))
});

UserDetails.propTypes = {
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default connect(undefined, mapDispatchToProps)(UserDetails);
