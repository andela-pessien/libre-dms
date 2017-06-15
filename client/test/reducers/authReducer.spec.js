import authReducer from '../../reducers/authReducer';
import { auth } from '../../actions/actionTypes';
import { getValidId } from '../../../scripts/data-generator';

describe('Authentication reducer', () => {
  it('should get initial state', () => {
    expect(authReducer()).toEqual({
      isAuthenticated: !!localStorage.getItem('libredms-token')
    });
  });

  it('should handle SIGNUP_SUCCESS', () => {
    const userId = getValidId();

    expect(authReducer({}, {
      type: auth.SIGNUP_SUCCESS,
      userId
    })).toEqual({
      isAuthenticated: true,
      currentUser: userId,
      signUpError: null,
      signInError: null
    });
  });

  it('should handle SIGNIN_SUCCESS', () => {
    const userId = getValidId();

    expect(authReducer({}, {
      type: auth.SIGNIN_SUCCESS,
      userId
    })).toEqual({
      isAuthenticated: true,
      currentUser: userId,
      signUpError: null,
      signInError: null
    });
  });

  it('should handle SIGNUP_FAILURE', () => {
    const error = { message: 'Oops!' };
    expect(authReducer({}, {
      type: auth.SIGNUP_FAILURE,
      error
    })).toEqual({
      isAuthenticated: false,
      currentUser: null,
      signUpError: error
    });
  });

  it('should handle SIGNIN_FAILURE', () => {
    const error = { message: 'Oops!' };
    expect(authReducer({}, {
      type: auth.SIGNIN_FAILURE,
      error
    })).toEqual({
      isAuthenticated: false,
      currentUser: null,
      signInError: error
    });
  });

  it('should handle SIGNOUT_SUCCESS', () => {
    expect(authReducer({}, {
      type: auth.SIGNOUT_SUCCESS
    })).toEqual({
      isAuthenticated: false,
      currentUser: null,
      signOutError: null
    });
  });

  it('should handle SIGNOUT_FAILURE', () => {
    const error = { message: 'Oops!' };
    expect(authReducer({}, {
      type: auth.SIGNOUT_FAILURE,
      error
    })).toEqual({
      isAuthenticated: true,
      signOutError: error
    });
  });
});
