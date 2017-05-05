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
        allDocuments: action.documents,
        allDocsMetadata: action.metadata
      };
    case document.GET_ALL_FAILURE:
      return {
        ...state,
        getAllDocsError: action.error,
        success: null
      };
    case document.GET_SUCCESS:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.document.id]: {
            document: action.document
          }
        }
      };
    case document.GET_FAILURE:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.id]: {
            ...state.documents[action.id],
            error: action.error
          }
        },
        success: null
      };
    case document.SEARCH_SUCCESS:
      return {
        ...state,
        docSearchResults: action.results,
        docSearchMetadata: action.metadata
      };
    case document.SEARCH_FAILURE:
      return {
        ...state,
        searchDocsError: action.error,
        success: null
      };
    case document.CREATE_SUCCESS:
      return {
        ...state,
        newDocument: {
          id: action.document.id
        },
        documents: {
          ...state.documents,
          [action.document.id]: {
            document: action.document
          }
        }
      };
    case document.CREATE_FAILURE:
      return {
        ...state,
        newDocument: {
          error: action.error
        },
        success: null
      };
    case document.UPDATE_SUCCESS:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.document.id]: {
            document: action.document
          }
        }
      };
    case document.UPDATE_FAILURE:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.id]: {
            ...state.documents[action.id],
            error: action.error
          }
        },
        success: null
      };
    case document.DELETE_SUCCESS:
      return {
        ...state,
        documents: Object.keys(state.documents).reduce((result, key) => {
          if (key !== action.id) {
            result[key] = state.documents[key];
          }
          return result;
        }, {})
      };
    case document.DELETE_FAILURE:
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.id]: {
            ...state.documents[action.id],
            error: action.error
          }
        },
        success: null
      };
    default:
      return state;
  }
}
