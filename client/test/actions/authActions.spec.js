/* eslint-disable max-len */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import * as actions from '../../actions/authActions';
import { auth, user } from '../../actions/actionTypes';
import { getValidUser } from '../../../scripts/data-helper';

const mockStore = configureMockStore([thunk]);

describe('Authentication actions', () => {
  const userData = getValidUser();

  afterEach(() => {
    nock.cleanAll();
  });

  it('should dispatch SIGNUP_SUCCESS and GET_SUCCESS on successful signup', () => {
    nock('/api')
      .post('/users')
      .reply(201, { body: { todos: ['do something'] }})

    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something']  } }
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(actions.fetchTodos())
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})