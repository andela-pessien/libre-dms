import React from 'react';
import PropTypes from 'prop-types';
import ProfileView from './ProfileView';

/**
 * Full-page wrapping component for a ProfileView
 * @param {Object} props The props for the component
 * @returns {String} The HTML markup for the component
 */
function ProfilePage(props) {
  if (props.params.param) {
    return (<ProfileView id={props.params.param} full />);
  }
  return (<ProfileView full />);
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
