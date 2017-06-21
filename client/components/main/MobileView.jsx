import React from 'react';
import PropTypes from 'prop-types';
import MobileSideMenu from './MobileSideMenu';
import SidePanel from './SidePanel';
import MainPanel from './MainPanel';

const MobileView = props => (
  <div className="mobile-view-wrapper">
    <MobileSideMenu
      ownId={props.ownId}
      changeFeedView={props.changeFeedView}
      getOwnDocuments={props.loadOwnDocuments}
      getAllDocuments={props.getAllDocuments}
      getAllUsers={props.getAllUsers}
    />
    {(props.showFeeds)
      ? <SidePanel {...props} />
      : <MainPanel {...props} isMobile />}
  </div>
);

MobileView.propTypes = {
  ownId: PropTypes.string.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getAllDocuments: PropTypes.func.isRequired,
  loadOwnDocuments: PropTypes.func.isRequired,
  changeFeedView: PropTypes.func.isRequired,
  showFeeds: PropTypes.bool.isRequired
};

export default MobileView;
