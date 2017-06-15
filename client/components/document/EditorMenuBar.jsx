import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfirmDialog from '../common/ConfirmDialog';
import { isSuperAdmin } from '../../utils/roles';

/**
 * Menu bar component for the DocumentEditor
 * @param {Object} props The props for the EditorMenuBar component
 * @returns {String} The HTML markup for the EditorMenuBar component
 */
class EditorMenuBar extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.onAccessClick = this.onAccessClick.bind(this);
  }

  /**
   * Event listener/handler for changing document access
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onAccessClick(e) {
    this.props.updateAttribute('access', e.target.name);
  }

  /**
   * Renders the EditorMenuBar component
   * @returns {String} The JSX markup for the component
   */
  render() {
    return (
      <div className="menu-bar">
        {(this.props.full || isSuperAdmin(this.props.users[this.props.ownId].user)) &&
          <a
            className="btn right delete-button menu-button"
            onClick={() => { $('#confirm-document-delete').modal('open'); }}
            role="menuitem"
          >
            <i className="material-icons large">delete</i>
          </a>}
        {(this.props.full) && <a
          className="dropdown-button btn left menu-button"
          data-activates="share-dropdown"
          data-beloworigin="true"
          data-hover="hover"
        >
          {this.props.access.toUpperCase()}&nbsp;<i className="material-icons">share</i>
        </a>}
        {(!this.props.full) &&
          <a className="menu-button left">{this.props.access.toUpperCase()}</a>}
        {(this.props.full) && <a className="status-container menu-button">
          <span className="status-span">{this.props.status}</span>
        </a>}
        {(this.props.full) && <ul
          id="share-dropdown"
          className="dropdown-content menu-dropdown"
        >
          <li><a>Share with...</a></li>
          <li className="divider" />
          <li className="clickable">
            <a
              id="private"
              name="private"
              role="menuitem"
              onClick={this.onAccessClick}
            >Yourself only</a></li>
          <li className="clickable">
            <a
              id="role"
              name="role"
              role="menuitem"
              onClick={this.onAccessClick}
            >People on the same role</a></li>
          <li className="clickable">
            <a
              id="public"
              name="public"
              role="menuitem"
              onClick={this.onAccessClick}
            >Everyone</a></li>
        </ul>}
        <ConfirmDialog
          id="confirm-document-delete"
          message="Are you sure you want to delete this document?"
          onYesClick={this.props.onDeleteClick}
          onNoClick={() => {}}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ownId: state.authReducer.currentUser,
  users: state.userReducer
});

EditorMenuBar.propTypes = {
  access: PropTypes.string.isRequired,
  full: PropTypes.bool,
  status: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  ownId: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired
};

EditorMenuBar.defaultProps = {
  full: false
};

export default connect(mapStateToProps)(EditorMenuBar);
