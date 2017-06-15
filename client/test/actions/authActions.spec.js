/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actions from '../../actions/authActions';
import { auth, user } from '../../actions/actionTypes';
import { getValidUser, getValidId } from '../../../scripts/data-generator';

const mockStore = configureMockStore([thunk]);

describe('Authentication action creators', () => {
  const userData = getValidUser();
  const credentials = {
    email: userData.email,
    password: userData.password
  };
  const createdUser = {
    id: getValidId(),
    name: userData.name,
    email: userData.email,
    roleId: 4
  };
  const signupError = {
    message: 'Please provide a valid email'
  };
  const signinError = {
    message: 'No user with that email exists'
  };
  const signoutError = {
    message: 'An error occurred signing out'
  };

  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should dispatch SIGNUP_SUCCESS and GET_USER_SUCCESS on successful signup', () => {
    moxios.stubRequest('/api/users', {
      status: 200,
      headers: {
        'x-access-token': 'valid_token'
      },
      response: createdUser
    });

    const expectedActions = [
      { type: user.GET_SUCCESS, user: createdUser },
      { type: auth.SIGNUP_SUCCESS, userId: createdUser.id }
    ];

    const store = mockStore();

    return store.dispatch(actions.signUp(userData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNUP_FAILURE on failed signup', () => {
    moxios.stubRequest('/api/users', {
      status: 400,
      response: signupError
    });
    const expectedActions = [
      { type: auth.SIGNUP_FAILURE, error: signupError }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signUp())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNUP_FAILURE if connection failed while trying to sign up', () => {
    moxios.stubRequest('/api/users', {
      status: 504
    });
    const expectedActions = [
      { type: auth.SIGNUP_FAILURE,
        error: { message: 'Connection failed' } }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signUp())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_SUCCESS and GET_USER_SUCCESS on successful signin', () => {
    moxios.stubRequest('/api/auth/login', {
      status: 200,
      headers: {
        'x-access-token': 'valid_token'
      },
      response: createdUser
    });

    const expectedActions = [
      { type: user.GET_SUCCESS, user: createdUser },
      { type: auth.SIGNIN_SUCCESS, userId: createdUser.id }
    ];

    const store = mockStore();

    return store.dispatch(actions.signIn(credentials))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_FAILURE on failed signin', () => {
    moxios.stubRequest('/api/auth/login', {
      status: 400,
      response: signinError
    });
    const expectedActions = [
      { type: auth.SIGNIN_FAILURE, error: signinError }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signIn(getValidUser()))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_FAILURE if connection failed while trying to sign in', () => {
    moxios.stubRequest('/api/auth/login', {
      status: 504
    });
    const expectedActions = [
      { type: auth.SIGNIN_FAILURE,
        error: { message: 'Connection failed' } }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signIn())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNOUT_SUCCESS on successful signout', () => {
    moxios.stubRequest('/api/auth/logout', {
      status: 200,
      headers: {
        'x-access-token': ''
      }
    });

    const expectedActions = [
      { type: auth.SIGNOUT_SUCCESS }
    ];

    const store = mockStore();

    return store.dispatch(actions.signOut())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNOUT_FAILURE on failed signout', () => {
    moxios.stubRequest('/api/auth/logout', {
      status: 400,
      response: signoutError
    });
    const expectedActions = [
      { type: auth.SIGNOUT_FAILURE, error: signoutError }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signOut())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNOUT_FAILURE if connection failed while trying to sign out', () => {
    moxios.stubRequest('/api/auth/logout', {
      status: 504
    });
    const expectedActions = [
      { type: auth.SIGNOUT_FAILURE,
        error: { message: 'Connection failed' } }
    ];

    const store = mockStore({});

    return store.dispatch(actions.signOut())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_SUCCESS and GET_USER_SUCCESS if stored token and user are still valid', () => {
    moxios.stubRequest(`/api/users/${createdUser.id}`, {
      status: 200,
      headers: {
        'x-access-token': 'valid_token'
      },
      response: createdUser
    });

    const expectedActions = [
      { type: user.GET_SUCCESS, user: createdUser },
      { type: auth.SIGNIN_SUCCESS, userId: createdUser.id }
    ];

    const store = mockStore();

    return store.dispatch(actions.getCurrentUser(createdUser.id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_FAILURE if stored token or user are invalid', () => {
    moxios.stubRequest(`/api/users/${createdUser.id}`, {
      status: 401,
      response: {
        message: 'Invalid access token'
      }
    });
    const expectedActions = [
      { type: auth.SIGNIN_FAILURE,
        error: {
          message: 'Invalid access token'
        } }
    ];

    const store = mockStore({});

    return store.dispatch(actions.getCurrentUser(createdUser.id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch SIGNIN_FAILURE if connection failed while verifying stored token', () => {
    moxios.stubRequest(`/api/users/${createdUser.id}`, {
      status: 504
    });
    const expectedActions = [
      { type: auth.SIGNIN_FAILURE,
        error: { message: 'Connection failed' } }
    ];

    const store = mockStore({});

    return store.dispatch(actions.getCurrentUser(createdUser.id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
