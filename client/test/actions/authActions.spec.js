/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import moxios from 'moxios';
import * as actions from '../../actions/authActions';
import { auth, user } from '../../actions/actionTypes';
import { getValidUser, getValidId } from '../../../scripts/data-generator';

const mockStore = configureMockStore([thunk, ReduxPromise]);

describe('Authentication action creators', () => {
  const userData = getValidUser();
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

  it('should dispatch SIGNUP_SUCCESS and GET_SUCCESS on successful signup', () => {
    moxios.stubRequest('POST', '/api/users', {
      status: 200,
      response: createdUser
    });

    const expectedActions = [
      { type: user.GET_SUCCESS, user: createdUser },
      { type: auth.SIGNUP_SUCCESS, userId: createdUser.id }
    ];

    const store = mockStore();

    return store.dispatch(actions.signUp(userData))
      .then(() => {
        console.log('Got here!');
        expect(store.getActions()).toEqual(undefined);
      });
  });

  it('should dispatch SIGNUP_FAILURE on failed signup', () => {
    moxios.stubRequest('POST', '/api/users', {
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
});
