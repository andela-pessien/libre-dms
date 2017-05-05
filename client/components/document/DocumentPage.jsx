import React from 'react';
import PropTypes from 'prop-types';
import DocumentView from './DocumentView';

/**
 * Full-page wrapping component for a DocumentView
 * @param {Object} props The props for the component
 * @returns {String} The HTML markup for the component
 */
function DocumentPage(props) {
  return (<DocumentView id={props.params.param} />);
}

DocumentPage.propTypes = {
  params: PropTypes.shape({
    param: PropTypes.string.isRequired
  }).isRequired
};

export default DocumentPage;
