import userReducer from '../../reducers/userReducer';
import { user } from '../../actions/actionTypes';
import { getValidId, getValidUser, getValidDoc } from '../../../scripts/data-generator';

describe('User reducer', () => {
  const error = { message: 'Oops!' };

  it('should get initial state', () => {
    expect(userReducer()).toEqual({});
  });

  it('should handle GET_ALL_USERS_SUCCESS', () => {
    const allUsers = {
      users: [getValidUser()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    expect(userReducer({}, {
      type: user.GET_ALL_SUCCESS,
      ...allUsers
    })).toEqual({
      all: {
        list: allUsers.users,
        metadata: allUsers.metadata
      }
    });
  });

  it('should handle GET_ALL_USERS_FAILURE', () => {
    expect(userReducer({}, {
      type: user.GET_ALL_FAILURE,
      error
    })).toEqual({
      all: {
        error
      }
    });
  });

  it('should handle GET_USER_SUCCESS', () => {
    const retrievedUser = {
      ...getValidUser(),
      id: getValidId()
    };

    expect(userReducer({}, {
      type: user.GET_SUCCESS,
      user: retrievedUser
    })).toEqual({
      [retrievedUser.id]: {
        user: retrievedUser,
        error: null
      }
    });
  });

  it('should handle GET_USER_FAILURE', () => {
    const id = getValidId();

    expect(userReducer({}, {
      type: user.GET_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle UPDATE_USER_SUCCESS', () => {
    const updatedUser = {
      ...getValidUser(),
      id: getValidId()
    };

    expect(userReducer({}, {
      type: user.UPDATE_SUCCESS,
      user: updatedUser
    })).toEqual({
      [updatedUser.id]: {
        user: updatedUser,
        error: null
      }
    });
  });

  it('should handle UPDATE_USER_FAILURE', () => {
    const id = getValidId();

    expect(userReducer({}, {
      type: user.UPDATE_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle DELETE_USER_SUCCESS', () => {
    const deletedUser = {
      ...getValidUser(),
      id: getValidId()
    };
    const otherUser = {
      ...getValidUser(),
      id: getValidId()
    };
    const state = {
      [deletedUser.id]: {
        user: deletedUser
      },
      [otherUser.id]: {
        user: otherUser
      }
    };

    expect(userReducer(state, {
      type: user.DELETE_SUCCESS,
      id: deletedUser.id
    })).toEqual({
      [otherUser.id]: {
        user: otherUser
      }
    });
  });

  it('should handle DELETE_USER_FAILURE', () => {
    const id = getValidId();

    expect(userReducer({}, {
      type: user.DELETE_FAILURE,
      id,
      error
    })).toEqual({
      [id]: {
        error
      }
    });
  });

  it('should handle GET_USER_DOCS_SUCCESS', () => {
    const docOwner = {
      ...getValidUser(),
      id: getValidId()
    };
    const state = {
      [docOwner.id]: {
        user: docOwner
      }
    };
    const retrievedDocs = {
      documents: [getValidDoc(docOwner.id)],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    expect(userReducer(state, {
      type: user.GET_DOCS_SUCCESS,
      id: docOwner.id,
      ...retrievedDocs
    })).toEqual({
      [docOwner.id]: {
        user: docOwner,
        documents: {
          list: retrievedDocs.documents,
          metadata: retrievedDocs.metadata
        }
      }
    });
  });

  it('should handle GET_USER_DOCS_FAILURE', () => {
    const docOwner = {
      ...getValidUser(),
      id: getValidId()
    };
    const state = {
      [docOwner.id]: {
        user: docOwner
      }
    };

    expect(userReducer(state, {
      type: user.GET_DOCS_FAILURE,
      id: docOwner.id,
      error
    })).toEqual({
      [docOwner.id]: {
        user: docOwner,
        documents: {
          error
        }
      }
    });
  });

  it('should handle USER_SEARCH_SUCCESS', () => {
    const searchResults = {
      results: [getValidUser()],
      metadata: {
        total: 1,
        pages: 1,
        currentPage: 1,
        pageSize: 10
      }
    };

    expect(userReducer({}, {
      type: user.SEARCH_SUCCESS,
      ...searchResults
    })).toEqual({
      search: {
        list: searchResults.results,
        metadata: searchResults.metadata
      }
    });
  });

  it('should handle USER_SEARCH_FAILURE', () => {
    expect(userReducer({}, {
      type: user.SEARCH_FAILURE,
      error
    })).toEqual({
      search: {
        error
      }
    });
  });
});
