import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

/**
 * Configure application store for production environment
 * It applies middleware and adds reducers
 * @param {Object} initialState Initial state of the application
 * @returns {Object} The configured store
 */
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  );
}
