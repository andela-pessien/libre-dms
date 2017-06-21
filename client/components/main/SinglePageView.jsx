import React from 'react';
import PropTypes from 'prop-types';
import SideMenu from './SideMenu';
import SidePanel from './SidePanel';
import MainPanel from './MainPanel';

/**
 * Component that renders application in a single page
 * @param {Object} props The props for the component
 * @returns {String} JSX markup for the SinglePageView component
 * @author Princess-Jewel Essien
 */
const SinglePageView = props => (
  <div className="row">
    <SideMenu
      changeFeedView={props.changeFeedView}
      getOwnDocuments={props.loadOwnDocuments}
      getAllDocuments={props.getAllDocuments}
      getAllUsers={props.getAllUsers}
    />
    <div className="col l4">
      <SidePanel {...props} />
    </div>
    <div className="col l7">
      <MainPanel {...props} />
    </div>
  </div>
);

SinglePageView.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  loadOwnDocuments: PropTypes.func.isRequired,
  changeFeedView: PropTypes.func.isRequired,
};

export default SinglePageView;
