/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../../actions/userActions';
import { auth, user } from '../../actions/actionTypes';
import { getValidUser, getValidId, getValidDoc } from '../../../scripts/data-generator';

const mockStore = configureMockStore([thunk]);

describe('User action creators', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const error = {
    message: 'Oops! Something went wrong on our end'
  };

  it('should dispatch GET_ALL_USERS_SUCCESS on successful retrieval of user list', () => {
    const allUsers = {
      list: [getValidUser()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    moxios.stubRequest('/api/users?limit=10&offset=0', {
      status: 200,
      headers: {},
      response: allUsers
    });

    const expectedActions = [
      { type: user.GET_ALL_SUCCESS, users: allUsers.list, metadata: allUsers.metadata }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllUsers(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_ALL_USERS_FAILURE on failed retrieval of user list', () => {
    moxios.stubRequest('/api/users?limit=10&offset=0', {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.GET_ALL_FAILURE, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllUsers(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_ALL_USERS_FAILURE if connection failed while retrieving users', () => {
    moxios.stubRequest('/api/users?limit=10&offset=0', {
      status: 504
    });

    const expectedActions = [
      { type: user.GET_ALL_FAILURE, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.getAllUsers(10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_USER_SUCCESS on successful retrieval of a user', () => {
    const retrievedUser = {
      ...getValidUser(),
      id: getValidId()
    };

    moxios.stubRequest(`/api/users/${retrievedUser.id}`, {
      status: 200,
      headers: {},
      response: retrievedUser
    });

    const expectedActions = [
      { type: user.GET_SUCCESS, user: retrievedUser }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUser(retrievedUser.id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_USER_FAILURE on failed retrieval of a user', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.GET_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUser(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_USER_FAILURE if connection failed while retrieving user', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: user.GET_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUser(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_SEARCH_SUCCESS on successful user search', () => {
    const searchResults = {
      list: [getValidUser()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    moxios.stubRequest('/api/search/users?q=lorem&limit=10&offset=0', {
      status: 200,
      headers: {},
      response: searchResults
    });

    const expectedActions = [
      { type: user.SEARCH_SUCCESS, results: searchResults.list, metadata: searchResults.metadata }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchUsers('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_SEARCH_FAILURE on failed user search', () => {
    moxios.stubRequest('/api/search/users?q=lorem&limit=10&offset=0', {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.SEARCH_FAILURE, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchUsers('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_SEARCH_FAILURE if connection failed while searching for users', () => {
    moxios.stubRequest('/api/search/users?q=lorem&limit=10&offset=0', {
      status: 504
    });

    const expectedActions = [
      { type: user.SEARCH_FAILURE, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.searchUsers('lorem', 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_UPDATE_SUCCESS on successful user update', () => {
    const updatedUser = {
      ...getValidUser(),
      id: getValidId()
    };
    const patch = {
      name: updatedUser.name
    };

    moxios.stubRequest(`/api/users/${updatedUser.id}`, {
      status: 200,
      headers: {},
      response: updatedUser
    });

    const expectedActions = [
      { type: user.UPDATE_SUCCESS, user: updatedUser }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateUser(updatedUser.id, patch))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_UPDATE_FAILURE on failed user update', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.UPDATE_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateUser(id, {}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_UPDATE_FAILURE if connection failed while updating user', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: user.UPDATE_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.updateUser(id, {}))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should dispatch USER_UPDATE_SUCCESS on successfully setting a user's role", () => {
    const roleId = 4;

    const updatedUser = {
      ...getValidUser(),
      id: getValidId(),
      roleId
    };

    moxios.stubRequest(`/api/users/set-role/${updatedUser.id}`, {
      status: 200,
      headers: {},
      response: updatedUser
    });

    const expectedActions = [
      { type: user.UPDATE_SUCCESS, user: updatedUser }
    ];

    const store = mockStore();

    return store.dispatch(actions.setUserRole(updatedUser.id, roleId))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should dispatch USER_UPDATE_FAILURE on failing to set user's role", () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/set-role/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.UPDATE_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.setUserRole(id, 1))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_UPDATE_FAILURE if connection failed while setting user role', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/set-role/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: user.UPDATE_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.setUserRole(id, 4))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_DELETE_SUCCESS and SIGNOUT_SUCCESS on deleting self', () => {
    const id = getValidId();
    moxios.stubRequest(`/api/users/${id}`, {
      status: 200,
      headers: {}
    });

    const expectedActions = [
      { type: user.DELETE_SUCCESS, id },
      { type: auth.SIGNOUT_SUCCESS }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteUser(id, true))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_DELETE_SUCCESS on deleting other user', () => {
    const id = getValidId();
    moxios.stubRequest(`/api/users/${id}`, {
      status: 200,
      headers: {}
    });

    const expectedActions = [
      { type: user.DELETE_SUCCESS, id }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteUser(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_DELETE_FAILURE on failed user deletion', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.DELETE_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteUser(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch USER_DELETE_FAILURE if connection failed while deleting user', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}`, {
      status: 504
    });

    const expectedActions = [
      { type: user.DELETE_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.deleteUser(id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should dispatch GET_USER_DOCS_SUCCESS on successful retrieval of user's documents", () => {
    const id = getValidId();

    const documents = {
      list: [getValidDoc(id)],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    moxios.stubRequest(`/api/users/${id}/documents?limit=10&offset=0`, {
      status: 200,
      headers: {},
      response: documents
    });

    const expectedActions = [
      { type: user.GET_DOCS_SUCCESS, id, documents: documents.list, metadata: documents.metadata }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUserDocuments(id, 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("should dispatch GET_USER_DOCS_FAILURE on failed retrieval of user's documents", () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}/documents?limit=10&offset=0`, {
      status: 500,
      headers: {},
      response: error
    });

    const expectedActions = [
      { type: user.GET_DOCS_FAILURE, id, error }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUserDocuments(id, 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch GET_ALL_USERS_FAILURE if connection failed while retrieving users', () => {
    const id = getValidId();

    moxios.stubRequest(`/api/users/${id}/documents?limit=10&offset=0`, {
      status: 504
    });

    const expectedActions = [
      { type: user.GET_DOCS_FAILURE, id, error: { message: 'Connection failed' } }
    ];

    const store = mockStore();

    return store.dispatch(actions.getUserDocuments(id, 10, 0))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
