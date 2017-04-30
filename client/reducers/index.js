import { combineReducers } from 'redux';
import authReducer from './authReducer';
import documentReducer from './documentReducer';

const appReducer = combineReducers({
  authReducer,
  documentReducer
});

export default appReducer;
