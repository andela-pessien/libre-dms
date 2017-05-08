import { auth } from '../actions/actionTypes';

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case auth.SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      };
    case auth.SIGNUP_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        signUpError: action.error,
        success: null
      };
    case auth.SIGNIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      };
    case auth.SIGNIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        signInError: action.error,
        success: null
      };
    case auth.SIGNOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };
    case auth.SIGNOUT_FAILURE:
      return {
        ...state,
        isAuthenticated: true,
        signOutError: action.error,
        success: null
      };
    case auth.SET_CURRENT_USER:
      return {
        ...state,
        user: Object.assign({}, action.user)
      };
    default:
      return {
        ...state,
        isAuthenticated: !!localStorage.getItem('libredms-token'),
        user: JSON.parse(localStorage.getItem('libredms-user')) || null
      };
  }
}
