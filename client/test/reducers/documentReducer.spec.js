import documentReducer from '../../reducers/documentReducer';
import { document } from '../../actions/actionTypes';
import { getValidId, getValidDoc } from '../../../scripts/data-generator';

describe('Document reducer', () => {
  const error = { message: 'Oops!' };

  it('should get initial state', () => {
    expect(documentReducer()).toEqual({});
  });

  it('should handle GET_ALL_DOCS_SUCCESS', () => {
    const allDocuments = {
      documents: [getValidDoc()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    expect(documentReducer({}, {
      type: document.GET_ALL_SUCCESS,
      ...allDocuments
    })).toEqual({
      all: {
        list: allDocuments.documents,
        metadata: allDocuments.metadata
      }
    });
  });

  it('should handle GET_ALL_DOCS_FAILURE', () => {
    expect(documentReducer({}, {
      type: document.GET_ALL_FAILURE,
      error
    })).toEqual({
      all: {
        error
      }
    });
  });

  it('should handle GET_DOCUMENT_SUCCESS', () => {
    const retrievedDocument = {
      ...getValidDoc(),
      id: getValidId()
    };

    expect(documentReducer({}, {
      type: document.GET_SUCCESS,
      document: retrievedDocument
    })).toEqual({
      [retrievedDocument.id]: {
        document: retrievedDocument
      }
    });
  });

  it('should handle GET_DOCUMENT_FAILURE', () => {
    const id = getValidId();

    expect(documentReducer({}, {
      type: document.GET_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle UPDATE_DOCUMENT_SUCCESS', () => {
    const updatedDocument = {
      ...getValidDoc(),
      id: getValidId()
    };

    expect(documentReducer({}, {
      type: document.UPDATE_SUCCESS,
      document: updatedDocument
    })).toEqual({
      [updatedDocument.id]: {
        document: updatedDocument
      }
    });
  });

  it('should handle UPDATE_DOCUMENT_FAILURE', () => {
    const id = getValidId();

    expect(documentReducer({}, {
      type: document.UPDATE_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle DELETE_DOCUMENT_SUCCESS', () => {
    const deletedDocument = {
      ...getValidDoc(),
      id: getValidId()
    };
    const otherDocument = {
      ...getValidDoc(),
      id: getValidId()
    };
    const state = {
      [deletedDocument.id]: {
        document: deletedDocument
      },
      [otherDocument.id]: {
        document: otherDocument
      }
    };

    expect(documentReducer(state, {
      type: document.DELETE_SUCCESS,
      id: deletedDocument.id
    })).toEqual({
      [otherDocument.id]: {
        document: otherDocument
      }
    });
  });

  it('should handle DELETE_DOCUMENT_FAILURE', () => {
    const id = getValidId();

    expect(documentReducer({}, {
      type: document.DELETE_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle DOCUMENT_SEARCH_SUCCESS', () => {
    const searchResults = {
      results: [getValidDoc()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    expect(documentReducer({}, {
      type: document.SEARCH_SUCCESS,
      ...searchResults
    })).toEqual({
      search: {
        list: searchResults.results,
        metadata: searchResults.metadata
      }
    });
  });

  it('should handle DOCUMENT_SEARCH_FAILURE', () => {
    expect(documentReducer({}, {
      type: document.SEARCH_FAILURE,
      error
    })).toEqual({
      search: {
        error
      }
    });
  });

  it('should handle DOCUMENT_CREATE_SUCCESS', () => {
    const newDocument = {
      ...getValidDoc(),
      id: getValidId()
    };

    expect(documentReducer({}, {
      type: document.CREATE_SUCCESS,
      document: newDocument
    })).toEqual({
      new: {
        id: newDocument.id
      },
      [newDocument.id]: {
        document: newDocument
      }
    });
  });

  it('should handle CLEAR_NEW_DOCUMENT', () => {
    const state = {
      all: {
        list: [],
        metadata: {}
      },
      new: {
        id: getValidId()
      }
    };
    expect(documentReducer(state, {
      type: document.CLEAR_NEW
    })).toEqual({
      all: {
        list: [],
        metadata: {}
      }
    });
  });

  it('should handle DOCUMENT_CREATE_FAILURE', () => {
    expect(documentReducer({}, {
      type: document.CREATE_FAILURE,
      error
    })).toEqual({
      new: {
        error
      }
    });
  });
});
