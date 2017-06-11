import { user } from '../actions/actionTypes';

/**
 * Reducer for user-related actions.
 * @param {Object} state The old state of the application
 * @param {Object} action The dispatched action
 * @returns {Object} The new application state
 */
export default function userReducer(state = {}, action) {
  switch (action.type) {
    case user.GET_ALL_SUCCESS:
      return {
        ...state,
        all: {
          list: action.users,
          metadata: action.metadata
        }
      };
    case user.GET_ALL_FAILURE:
      return {
        ...state,
        all: {
          ...state.allUsers,
          error: action.error
        },
        success: null
      };
    case user.GET_SUCCESS:
    case user.UPDATE_SUCCESS:
      return {
        ...state,
        [action.user.id]: {
          ...state[action.user.id],
          user: action.user
        }
      };
    case user.GET_FAILURE:
    case user.UPDATE_FAILURE:
    case user.DELETE_FAILURE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          error: action.error
        },
        success: null
      };
    case user.GET_DOCS_SUCCESS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          documents: {
            list: action.documents,
            metadata: action.metadata
          }
        }
      };
    case user.GET_DOCS_FAILURE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          documents: {
            ...state[action.id].documents,
            error: action.error
          }
        },
        success: null
      };
    case user.SEARCH_SUCCESS:
      return {
        ...state,
        search: {
          list: action.results,
          metadata: action.metadata
        }
      };
    case user.SEARCH_FAILURE:
      return {
        ...state,
        search: {
          ...state.userSearch,
          error: action.error
        },
        success: null
      };
    case user.DELETE_SUCCESS:
      return Object.keys(state).reduce((result, key) => {
        if (key !== action.id) {
          result[key] = state[key];
        }
        return result;
      }, {});
    default:
      return state;
  }
}
