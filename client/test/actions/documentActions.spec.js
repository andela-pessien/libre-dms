/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../../actions/documentActions';
import { document } from '../../actions/actionTypes';
import { getValidDoc, getValidId } from '../../../scripts/data-generator';

const mockStore = configureMockStore([thunk]);

describe('Document action creators', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const error = {
    message: 'Oops! Something went wrong on our end'
  };

  it('should dispatch GET_ALL_DOCS_SUCCESS on successful retrieval of document list', () => {
    const allDocuments = {
      list: [getValidDoc()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    moxios.stubRequest('/api/documents?limit=10&offset=0', {
      status: 200,
      headers: {},
      response: allDocuments
    });

    const expectedActions = [
      { type: document.GET_ALL_SUCCESS, documents: allDocuments.list, metadata: allDocuments.metadata }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllDocuments(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_ALL_DOCS_FAILURE on failed retrieval of document list', () => {
    moxios.stubRequest('/api/documents?limit=10&offset=0', {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.GET_ALL_FAILURE, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllDocuments(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_ALL_DOCS_FAILURE if connection failed while retrieving documents', () => {
    moxios.stubRequest('/api/documents?limit=10&offset=0', {
      status: 504
    });

    const expectedActions = [
      { type: document.GET_ALL_FAILURE, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllDocuments(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_DOCUMENT_SUCCESS on successful retrieval of a document', () => {
    const retrievedDocument = {
      ...getValidDoc(),
      id: getValidId()
    };

    moxios.stubRequest(`/api/documents/${retrievedDocument.id}`, {
      status: 200,
      headers: {},
      response: retrievedDocument
    });

    const expectedActions = [
      { type: document.GET_SUCCESS, document: retrievedDocument }
    ];

    const store = mockStore();

    return store.dispatch(actions.getDocument(retrievedDocument.id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_DOCUMENT_FAILURE on failed retrieval of a document', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.GET_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.getDocument(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_DOCUMENT_FAILURE if connection failed while retrieving document', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: document.GET_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.getDocument(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_SEARCH_SUCCESS on successful document search', () => {
    const searchResults = {
      list: [getValidDoc()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    moxios.stubRequest('/api/search/documents?q=lorem&limit=10&offset=0', {
      status: 200,
      headers: {},
      response: searchResults
    });

    const expectedActions = [
      { type: document.SEARCH_SUCCESS, results: searchResults.list, metadata: searchResults.metadata }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchDocuments('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_SEARCH_FAILURE on failed document search', () => {
    moxios.stubRequest('/api/search/documents?q=lorem&limit=10&offset=0', {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.SEARCH_FAILURE, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchDocuments('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_SEARCH_FAILURE if connection failed while searching for documents', () => {
    moxios.stubRequest('/api/search/documents?q=lorem&limit=10&offset=0', {
      status: 504
    });

    const expectedActions = [
      { type: document.SEARCH_FAILURE, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchDocuments('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_CREATE_SUCCESS on successful document creation', () => {
    const newDocument = getValidDoc();
    const createdDocument = {
      ...newDocument,
      id: getValidId()
    };

    moxios.stubRequest('/api/documents', {
      status: 200,
      headers: {},
      response: createdDocument
    });

    const expectedActions = [
      { type: document.CREATE_SUCCESS, document: createdDocument }
    ];

    const store = mockStore();

    return store.dispatch(actions.createDocument(newDocument))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_CREATE_FAILURE on failed document creation', () => {
    moxios.stubRequest('/api/documents', {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.CREATE_FAILURE, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.createDocument({}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_CREATE_FAILURE if connection failed while creating document', () => {
    moxios.stubRequest('/api/documents', {
      status: 504
    });

    const expectedActions = [
      { type: document.CREATE_FAILURE, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.createDocument({}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_UPDATE_SUCCESS on successful document update', () => {
    const updatedDocument = {
      ...getValidDoc(),
      id: getValidId()
    };
    const patch = {
      title: updatedDocument.title
    };

    moxios.stubRequest(`/api/documents/${updatedDocument.id}`, {
      status: 200,
      headers: {},
      response: updatedDocument
    });

    const expectedActions = [
      { type: document.UPDATE_SUCCESS, document: updatedDocument }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateDocument(updatedDocument.id, patch))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_UPDATE_FAILURE on failed document update', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.UPDATE_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateDocument(id, {}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_UPDATE_FAILURE if connection failed while updating document', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: document.UPDATE_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateDocument(id, {}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_DELETE_SUCCESS on deleting document', () => {
    const id = getValidId();
    moxios.stubRequest(`/api/documents/${id}`, {
      status: 200,
      headers: {}
    });

    const expectedActions = [
      { type: document.DELETE_SUCCESS, id }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteDocument(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_DELETE_FAILURE on failed document deletion', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: document.DELETE_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteDocument(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch DOCUMENT_DELETE_FAILURE if connection failed while deleting document', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/documents/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: document.DELETE_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteDocument(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
