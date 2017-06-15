import React from 'react';
import PropTypes from 'prop-types';
import Preloader from '../common/Preloader';
import parseDate from '../../utils/chronology';

/**
 * Component that displays a feed of documents.
 * @param {Object} props The props for the component
 * @returns {String} JSX markup for DocumentFeed component
 */
function DocumentFeed({ documents, documentClickAction, profileClickAction }) {
  return (
    <div className="feed">
      {(documents.error) && <h5 className="middle">{documents.error.message}</h5>}
      {(!documents.error && Array.isArray(documents.list))
        ? ((documents.list.length > 0)
          ? <ul>
            {documents.list.map(document =>
              <div key={document.id}>
                <li>
                  <h5>
                    <a
                      onClick={documentClickAction}
                      name={document.id}
                      className="truncate"
                      href="#!"
                    >
                      {document.title || 'Untitled Document'}
                    </a>
                  </h5>
                  {(document.User) &&
                    <a
                      onClick={profileClickAction}
                      name={document.userId}
                      href="#!"
                    >
                      {document.User.name}
                    </a>}
                  <div>
                    <p>
                      Last edited: {document.updatedAt
                        ? parseDate(document.updatedAt)
                        : parseDate(document.createdAt)}
                    </p>
                    <p>{document.access.toUpperCase()}</p>
                  </div>
                </li>
                <li className="divider" />
              </div>)}
          </ul>
          : <h5 className="middle">No documents to display</h5>)
        : <Preloader className="middle" />}
    </div>
  );
}

DocumentFeed.propTypes = {
  documents: PropTypes.object.isRequired,
  profileClickAction: PropTypes.func.isRequired,
  documentClickAction: PropTypes.func.isRequired
};

export default DocumentFeed;
