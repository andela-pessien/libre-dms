import React from 'react';
import PropTypes from 'prop-types';
import DocumentView from './DocumentView';
import Navbar from '../common/Navbar';

/**
 * Full-page wrapping component for a DocumentView
 * @param {Object} props The props for the component
 * @returns {String} The HTML markup for the component
 */
function DocumentPage(props) {
  return (
    <div className="document-wrapper">
      <Navbar />
      <DocumentView id={props.params.param} />
    </div>
  );
}

DocumentPage.propTypes = {
  params: PropTypes.shape({
    param: PropTypes.string.isRequired
  }).isRequired
};

export default DocumentPage;
