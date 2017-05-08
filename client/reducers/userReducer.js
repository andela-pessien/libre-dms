import { user } from '../actions/actionTypes';

/**
 * Reducer for user-related actions.
 * @param {Object} state The old state of the application
 * @param {Object} action The dispatched action
 * @returns {Object} The new application state
 */
export default function userReducer(state = { users: {} }, action) {
  switch (action.type) {
    case user.GET_ALL_SUCCESS:
      return {
        ...state,
        allUsers: action.users,
        allUsersMetadata: action.metadata
      };
    case user.GET_ALL_FAILURE:
      return {
        ...state,
        getAllUsersError: action.error,
        success: null
      };
    case user.GET_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.user.id]: {
            user: action.user
          }
        }
      };
    case user.GET_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            error: action.error
          }
        },
        success: null
      };
    case user.GET_DOCS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            documents: action.documents
          }
        }
      };
    case user.GET_DOCS_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            error: action.error
          }
        },
        success: null
      };
    case user.SEARCH_SUCCESS:
      return {
        ...state,
        userSearchResults: action.results,
        userSearchMetadata: action.metadata
      };
    case user.SEARCH_FAILURE:
      return {
        ...state,
        searchUsersError: action.error,
        success: null
      };
    case user.UPDATE_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.user.id]: {
            user: action.user
          }
        }
      };
    case user.UPDATE_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            error: action.error
          }
        },
        success: null
      };
    case user.DELETE_SUCCESS:
      return {
        ...state,
        users: Object.keys(state.users).reduce((result, key) => {
          if (key !== action.id) {
            result[key] = state.users[key];
          }
          return result;
        }, {})
      };
    case user.DELETE_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          [action.id]: {
            ...state.users[action.id],
            error: action.error
          }
        },
        success: null
      };
    default:
      return state;
  }
}
