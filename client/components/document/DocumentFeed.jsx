import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
      {(documents.error)
        ? <h5 className="middle">{documents.error.message}</h5>
        : (Array.isArray(documents.list))
          ? ((documents.list.length > 0)
            ? <ul>
              {documents.list.map(document =>
                <div key={document.id}>
                  <li>
                    <h5>
                      {(documentClickAction)
                        ? <a
                          onClick={documentClickAction}
                          name={document.id}
                        >
                          {document.title || 'Untitled Document'}
                        </a>
                        : <Link to={`/document/${document.id}`}>
                          {document.title}
                        </Link>}
                    </h5>
                    {(document.User) &&
                      ((profileClickAction)
                        ? <a
                          onClick={profileClickAction}
                          name={document.userId}
                          className="right"
                        >
                          {document.User.name}
                        </a>
                        : <Link
                          className="right"
                          to={`/profile/${document.userId}`}
                        >
                          {document.User.name}
                        </Link>)}
                    <p>
                      Last edited: {document.updatedAt
                        ? parseDate(document.updatedAt)
                        : parseDate(document.createdAt)}
                    </p>
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
  documents: PropTypes.object.isRequired,
  profileClickAction: PropTypes.func.isRequired,
  documentClickAction: PropTypes.func.isRequired
};

export default DocumentFeed;
