import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Preloader from '../common/Preloader';

/**
 * Component that displays a feed of users.
 * @param {Object} props The props for the component
 * @returns {String} JSX markup for UserFeed component
 */
function UserFeed({ users, profileClickAction }) {
  return (
    <div className="feed">
      {(users.error)
        ? <h5 className="middle">{users.error.message}</h5>
        : (Array.isArray(users.list))
          ? ((users.list.length > 0)
            ? <ul>
              {users.list.map(user =>
                <div key={user.id}>
                  <li>
                    <h5>
                      {(profileClickAction)
                        ? <a
                          onClick={profileClickAction}
                          name={user.id}
                        >
                          {user.name}
                        </a>
                        : <Link to={`/profile/${user.id}`}>
                          {user.name}
                        </Link>}
                    </h5>
                  </li>
                  <li className="divider" />
                </div>)}
            </ul>
            : <h5 className="middle">No users to display</h5>)
          : <Preloader className="middle" />
      }
    </div>
  );
}

UserFeed.propTypes = {
  users: PropTypes.object.isRequired,
  profileClickAction: PropTypes.func.isRequired,
};

export default UserFeed;
