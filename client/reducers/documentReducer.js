import { document } from '../actions/actionTypes';

/**
 * Reducer for document-related actions.
 * @param {Object} state The old state of the application
 * @param {Object} action The dispatched action
 * @returns {Object} The new application state
 */
export default function documentReducer(state = { documents: {} }, action) {
  switch (action.type) {
    case document.GET_ALL_SUCCESS:
      return {
        ...state,
        all: {
          list: action.documents,
          metadata: action.metadata
        }
      };
    case document.GET_ALL_FAILURE:
      return {
        ...state,
        all: {
          ...state.allDocuments,
          error: action.error
        },
        success: null
      };
    case document.GET_SUCCESS:
      return {
        ...state,
        [action.document.id]: {
          document: action.document
        }
      };
    case document.GET_FAILURE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          error: action.error
        },
        success: null
      };
    case document.SEARCH_SUCCESS:
      return {
        ...state,
        search: {
          results: action.results,
          metadata: action.metadata
        }
      };
    case document.SEARCH_FAILURE:
      return {
        ...state,
        search: {
          ...state.search,
          error: action.error
        },
        success: null
      };
    case document.CREATE_SUCCESS:
      return {
        ...state,
        new: {
          id: action.document.id
        },
        [action.document.id]: {
          document: action.document
        }
      };
    case document.CREATE_FAILURE:
      return {
        ...state,
        new: {
          error: action.error
        },
        success: null
      };
    case document.UPDATE_SUCCESS:
      return {
        ...state,
        [action.document.id]: {
          document: action.document
        }
      };
    case document.UPDATE_FAILURE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          error: action.error
        },
        success: null
      };
    case document.DELETE_SUCCESS:
      return Object.keys(state).reduce((result, key) => {
        if (key !== action.id) {
          result[key] = state.users[key];
        }
        return result;
      }, {});
    case document.DELETE_FAILURE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          error: action.error
        },
        success: null
      };
    default:
      return state;
  }
}
