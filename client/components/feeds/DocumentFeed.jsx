import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Preloader from '../common/Preloader';

/**
 * Component that displays a feed of documents.
 * @param {Object} props The props for the component
 * @returns {String} JSX markup for DocumentFeed component
 */
function DocumentFeed({ documents }) {
  return (
    <div className="feed">
      {(Array.isArray(documents))
        ? ((documents.length > 0)
          ? <ul>
            {documents.map(document =>
              <div key={document.id}>
                <li>
                  <h5><Link to={`/document/${document.id}`}>
                    {document.title}
                  </Link></h5>
                  {(document.User) &&
                    <h6><Link to={`/profile/${document.userId}`}>
                      {document.User.name}
                    </Link></h6>}
                </li>
                <li className="divider" />
              </div>)}
          </ul>
          : <h5 className="middle">No documents to display</h5>)
        : <Preloader className="middle" />
      }
    </div>
  );
}

DocumentFeed.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DocumentFeed;
