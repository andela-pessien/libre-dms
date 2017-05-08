import { combineReducers } from 'redux';
import authReducer from './authReducer';
import documentReducer from './documentReducer';
import userReducer from './userReducer';

const appReducer = combineReducers({
  authReducer,
  documentReducer,
  userReducer
});

export default appReducer;
