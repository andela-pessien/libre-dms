import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.onAccessLevelClick = this.onAccessLevelClick.bind(this);
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
   * Event listener/handler for changing document access level
   * @param {Object} e The click event
   * @returns {undefined}
   */
  onAccessLevelClick(e) {
    this.props.updateAttribute('accesslevel', e.target.name);
  }

  /**
   * Renders the EditorMenuBar component
   * @returns {String} The JSX markup for the component
   */
  render() {
    return (
      <div className="menu-bar">
        <a
          className="dropdown-button btn left menu-button"
          data-activates="file-dropdown"
          data-beloworigin="true"
        >
          <span>File</span>
        </a>
        <a
          className="dropdown-button btn left menu-button"
          data-activates="share-dropdown"
          data-beloworigin="true"
        >
          <span>Sharing</span>
        </a>
        <a className="status-container menu-button">
          <span className="status-span">{this.props.status}</span>
        </a>
        <ul id="file-dropdown" className="dropdown-content menu-dropdown">
          <li>
            <a onClick={this.props.onDeleteClick} role="menuitem">Delete</a>
          </li>
        </ul>
        <ul
          id="share-dropdown"
          className="dropdown-content nested menu-dropdown"
        >
          <li>
            <a
              className="dropdown-button"
              data-activates="access-dropdown"
              data-hover="hover"
            >Share with...</a>
          </li>
          <li>
            <a
              className="dropdown-button"
              data-activates="accesslevel-dropdown"
              data-hover="hover"
            >Access control...</a>
          </li>
        </ul>
        <ul id="access-dropdown" className="dropdown-content menu-dropdown">
          <li>
            <a
              id="private"
              name="private"
              role="menuitem"
              onClick={this.onAccessClick}
            >Yourself only</a></li>
          <li>
            <a
              id="public"
              name="public"
              role="menuitem"
              onClick={this.onAccessClick}
            >Everyone</a></li>
        </ul>
        <ul
          id="accesslevel-dropdown"
          className="dropdown-content menu-dropdown"
        >
          <li>
            <a
              id="view"
              name="view"
              role="menuitem"
              onClick={this.onAccessLevelClick}
            >View only</a></li>
          <li>
            <a
              id="comment"
              name="comment"
              role="menuitem"
              onClick={this.onAccessLevelClick}
            >Comment but not edit</a></li>
          <li>
            <a
              id="edit"
              name="edit"
              role="menuitem"
              onClick={this.onAccessLevelClick}
            >Edit and comment</a></li>
        </ul>
      </div>
    );
  }
}

EditorMenuBar.propTypes = {
  status: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired
};

export default EditorMenuBar;
