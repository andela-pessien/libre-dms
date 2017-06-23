/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import AuthPanel from '../../../components/authentication/AuthPanel';

const mockStore = configureMockStore([thunk]);

describe('AuthPanel component', () => {
  let authPanel;
  const store = mockStore({
    authReducer: {}
  });

  beforeEach(() => {
    authPanel = mount(<Provider store={store}><AuthPanel /></Provider>);
  });

  it('renders without crashing', () => {
    expect(authPanel.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(authPanel.find('.auth-panel').length).toBe(1);
  });

  it('should have tabs for signin and signup', () => {
    expect(authPanel.find('.card-tabs').length).toBe(1);
    expect(authPanel.find('.tabs').length).toBe(1);
    expect(authPanel.find('.tab').length).toBe(2);
    expect(authPanel.find('.signup-tab').text()).toEqual('Sign Up');
    expect(authPanel.find('.signin-tab').text()).toEqual('Sign In');
    expect(authPanel.find('#signup').length).toBe(1);
    expect(authPanel.find('#signin').length).toBe(1);
  });

  it('should mount subcomponents successfully', () => {
    expect(authPanel.find('.signup-form').length).toBe(1);
    expect(authPanel.find('.signin-form').length).toBe(1);
  });
});
