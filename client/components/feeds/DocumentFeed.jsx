import React from 'react';
import { Link } from 'react-router';

function DocumentFeed({ documents }) {
  return (
    <div className="feed">
      {Array.isArray(documents) ?
        (documents.length > 0 ?
          <ul>
            {documents.map(document =>
              <div key={document.id}>
                <li>
                  <h5><Link to={`/document/${document.id}`}>
                    {document.title}
                  </Link></h5>
                  <h6><Link to={`/profile/${document.userId}`}>
                    {document.userName}
                  </Link></h6>
                </li>
                <li className="divider" />
              </div>)}
          </ul> :
          <div className="valign-wrapper">
            <h5 className="center-align">No documents to display</h5>
          </div>
        ) :
          <div className="valign-wrapper">
            <h5 className="center-align">Loading documents...</h5>
          </div>
      }
    </div>
  );
}

export default DocumentFeed;
