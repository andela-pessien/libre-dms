import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SideMenu from '../../../components/main/SideMenu';

describe('SideMenu component', () => {
  let sideMenu;
  const div = global.document.createElement('div');
  const props = {
    changeFeedView: sinon.spy(() => {}),
    getOwnDocuments: sinon.spy(() => {}),
    getAllDocuments: sinon.spy(() => {}),
    getAllUsers: sinon.spy(() => {})
  };

  beforeEach(() => {
    global.document.body.appendChild(div);
    sideMenu = mount(<SideMenu {...props} />, { attachTo: div });
  });

  afterEach(() => {
    sideMenu.detach();
    global.document.body.removeChild(div);
  });

  it('renders without crashing', () => {
    expect(sideMenu.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(sideMenu.find('.fixed-side-menu').length).toBe(1);
    expect(sideMenu.find('.fixed-side-menu-item').length).toBe(4);
  });

  it('has tooltips on the menu items', () => {
    expect(sideMenu.find('.fixed-side-menu-item > .tooltipped').length).toBe(4);
  });

  it('should switch active view to Settings on clicking settings button', () => {
    sideMenu.find('#settings-button').simulate('click');
    expect(sideMenu.props().changeFeedView.callCount).toBe(1);
    expect(sideMenu.props().changeFeedView.getCall(0).args[0])
      .toEqual('showSettingsFeed');
    expect(sideMenu.find('.active').length).toBe(1);
    expect(sideMenu.find('#settings-button').hasClass('active')).toBe(true);
  });

  it('should switch active view to and load all users on clicking people button', () => {
    sideMenu.find('#people-button').simulate('click');
    expect(sideMenu.props().changeFeedView.callCount).toBe(2);
    expect(sideMenu.props().changeFeedView.getCall(1).args[0])
      .toEqual('showPeopleFeed');
    expect(sideMenu.props().getAllUsers.calledOnce).toBe(true);
    expect(sideMenu.find('.active').length).toBe(1);
    expect(sideMenu.find('#people-button').hasClass('active')).toBe(true);
  });

  it('should switch active view to and load all documents on clicking public button', () => {
    sideMenu.find('#public-button').simulate('click');
    expect(sideMenu.props().changeFeedView.callCount).toBe(3);
    expect(sideMenu.props().changeFeedView.getCall(2).args[0])
      .toEqual('showAllFeed');
    expect(sideMenu.props().getAllDocuments.calledOnce).toBe(true);
    expect(sideMenu.find('.active').length).toBe(1);
    expect(sideMenu.find('#public-button').hasClass('active')).toBe(true);
  });

  it('should switch active view to and load own documents on clicking own documents button', () => {
    sideMenu.find('#own-documents-button').simulate('click');
    expect(sideMenu.props().changeFeedView.callCount).toBe(4);
    expect(sideMenu.props().changeFeedView.getCall(3).args[0])
      .toEqual('showOwnFeed');
    expect(sideMenu.props().getOwnDocuments.calledOnce).toBe(true);
    expect(sideMenu.find('.active').length).toBe(1);
    expect(sideMenu.find('#own-documents-button').hasClass('active')).toBe(true);
  });
});
