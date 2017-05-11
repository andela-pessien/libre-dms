import React from 'react';
import PropTypes from 'prop-types';
import ProfileView from './ProfileView';
import Navbar from '../common/Navbar';
import { getCurrentUserId } from '../../utils/currentUser';

/**
 * Full-page wrapping component for a ProfileView
 * @param {Object} props The props for the component
 * @returns {String} The HTML markup for the component
 */
function ProfilePage(props) {
  return (
    <div className="document-wrapper">
      <Navbar />
      <ProfileView id={props.params.param || getCurrentUserId()} full />
    </div>
  );
}

ProfilePage.propTypes = {
  params: PropTypes.shape({
    param: PropTypes.string
  })
};

ProfilePage.defaultProps = {
  params: { param: '' }
};

export default ProfilePage;
