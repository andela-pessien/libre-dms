import { document } from '../actions/actionTypes';

export default function documentReducer(state = {}, action) {
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
    default:
      return state;
  }
}
