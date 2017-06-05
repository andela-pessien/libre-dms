import { createStore, applyMiddleware } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
// eslint-disable-next-line import/no-extraneous-dependencies
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

/**
 * Configure application store for development environment
 * Apart from applying middleware and adding reducers, it also includes
 * development tools.
 * @param {Object} initialState Initial state of the application
 * @returns {Object} The configured store
 */
export default function configureStore(initialState) {
  return createStore(rootReducer,
  initialState, composeWithDevTools(
    applyMiddleware(thunk, reduxImmutableStateInvariant())
  ));
}
