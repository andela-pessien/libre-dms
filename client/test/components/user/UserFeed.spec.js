import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import UserFeed from '../../../components/user/UserFeed';

describe('UserFeed component', () => {
  let userFeed;
  const props = {
    users: {},
    profileClickAction: sinon.spy(() => {})
  };

  beforeEach(() => {
    userFeed = mount(<UserFeed {...props} />);
  });

  it('renders without crashing', () => {
    expect(userFeed.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(userFeed.find('.feed').length).toBe(1);
  });

  it('displays preloader if users have not yet loaded', () => {
    expect(userFeed.find('.preloader-wrapper').length).toBe(1);
    expect(userFeed.find('h5').length).toBe(0);
    expect(userFeed.find('ul').length).toBe(0);
  });

  it('displays error message if there was an error retrieving users', () => {
    userFeed.setProps({
      users: {
        error: {
          message: 'Connection failed'
        }
      }
    });
    expect(userFeed.find('.preloader-wrapper').length).toBe(0);
    expect(userFeed.find('h5').length).toBe(1);
    expect(userFeed.find('ul').length).toBe(0);
    expect(userFeed.find('h5').text()).toBe('Connection failed');
  });

  it('informs user if there are no users to display', () => {
    userFeed.setProps({
      users: {
        list: []
      }
    });
    expect(userFeed.find('.preloader-wrapper').length).toBe(0);
    expect(userFeed.find('h5').length).toBe(1);
    expect(userFeed.find('ul').length).toBe(0);
    expect(userFeed.find('h5').text()).toBe('No users to display');
  });

  it('displays list of users if present', () => {
    userFeed.setProps({
      users: {
        list: [
          {
            id: '7ec48f91-6ddd-475c-b534-adf194fea4bb',
            name: 'John Doe'
          },
          {
            id: '76e75e53-ef30-401b-9a60-d05be8bd4270',
            name: 'Jane Doe'
          }
        ]
      }
    });
    expect(userFeed.find('.preloader-wrapper').length).toBe(0);
    expect(userFeed.find('h5.middle').length).toBe(0);
    expect(userFeed.find('ul').length).toBe(1);
    expect(userFeed.find('li').length).toBe(3);
    expect(userFeed.find('.divider').length).toBe(1);
    expect(userFeed.find('li > h5 > a').length).toBe(2);
    expect(userFeed.find('li > h5 > a')
      .filterWhere(item => (item.prop('name') === '7ec48f91-6ddd-475c-b534-adf194fea4bb'))
      .text()).toEqual('John Doe');
    expect(userFeed.find('li > h5 > a')
      .filterWhere(item => (item.prop('name') === '76e75e53-ef30-401b-9a60-d05be8bd4270'))
      .text()).toEqual('Jane Doe');
  });

  it('calls the profileClickAction prop when user name is clicked', () => {
    userFeed.setProps({
      users: {
        list: [
          {
            id: '7ec48f91-6ddd-475c-b534-adf194fea4bb',
            name: 'John Doe'
          },
          {
            id: '76e75e53-ef30-401b-9a60-d05be8bd4270',
            name: 'Jane Doe'
          }
        ]
      }
    });
    expect(userFeed.props().profileClickAction.calledOnce).toBe(false);
    userFeed.find('a')
      .filterWhere(item => (item.prop('name') === '7ec48f91-6ddd-475c-b534-adf194fea4bb'))
      .simulate('click');
    expect(userFeed.props().profileClickAction.calledOnce).toBe(true);
    userFeed.find('a')
      .filterWhere(item => (item.prop('name') === '76e75e53-ef30-401b-9a60-d05be8bd4270'))
      .simulate('click');
    expect(userFeed.props().profileClickAction.calledTwice).toBe(true);
  });
});
