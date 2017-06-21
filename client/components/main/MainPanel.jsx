import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfileView from '../user/ProfileView';
import DocumentView from '../document/DocumentView';
import SecurityPanel from './SecurityPanel';

/**
 * Class that displays documents, profiles or settings
 * @author Princess-Jewel Essien
 */
class MainPanel extends Component {
  /**
   * @param {Object} props The props for the component
   * @constructor
   */
  constructor(props) {
    super(props);
    this.unmountView = this.unmountView.bind(this);
  }

  /**
   * Unmounts and closes main view
   * @returns {undefined}
   */
  unmountView() {
    this.props.changeView();
  }

  /**
   * Renders the MainPanel component
   * @returns {String} JSX markup for the MainPanel component
   */
  render() {
    return (this.props.showDocumentId || this.props.showProfileId || this.props.showSettings) &&
      <div className="card main-panel">
        {(this.props.showDocumentId) &&
          <div className="main-view">
            <DocumentView
              id={this.props.showDocumentId}
              isMobile={this.props.isMobile}
              close={this.unmountView}
            />
          </div>}
        {(this.props.showProfileId) &&
          <div className="main-view">
            <ProfileView id={this.props.showProfileId} close={this.unmountView} />
          </div>}
        {(this.props.showSettings) &&
          <div className="main-view">
            <SecurityPanel />
          </div>}
        <a
          className="btn-floating indigo darken-4 main-close z-depth-3"
          onClick={this.unmountView}
          role="button"
        >
          <i className="material-icons">close</i>
        </a>
      </div>;
  }
}

MainPanel.propTypes = {
  changeView: PropTypes.func.isRequired,
  showDocumentId: PropTypes.string.isRequired,
  showProfileId: PropTypes.string.isRequired,
  showSettings: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool
};

MainPanel.defaultProps = {
  isMobile: false
};

export default MainPanel;
