import { auth } from '../actions/actionTypes';

/**
 * Reducer for authentication-related actions.
 * @param {Object} state The old state of the application
 * @param {Object} action The dispatched action
 * @returns {Object} The new application state
 */
export default function authReducer(state = {}, action) {
  switch (action.type) {
    case auth.SIGNUP_SUCCESS:
    case auth.SIGNIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.userId,
        signUpError: null
      };
    case auth.SIGNUP_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        signUpError: action.error,
        success: null
      };
    case auth.SIGNIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        signInError: action.error,
        success: null
      };
    case auth.SIGNOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        signOutError: null
      };
    case auth.SIGNOUT_FAILURE:
      return {
        ...state,
        isAuthenticated: true,
        signOutError: action.error,
        success: null
      };
    default:
      return {
        ...state,
        isAuthenticated: !!localStorage.getItem('libredms-token')
      };
  }
}
