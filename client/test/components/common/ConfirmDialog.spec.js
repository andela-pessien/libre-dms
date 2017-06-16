import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

describe('ConfirmDialog component', () => {
  let confirmDialog;
  const props = {
    id: 'test-confirm',
    message: 'Are you sure you want to run this test?',
    onYesClick: sinon.spy(() => {}),
    onNoClick: sinon.spy(() => {})
  };

  beforeEach(() => {
    confirmDialog = mount(<ConfirmDialog {...props} />);
  });

  it('renders without crashing', () => {
    expect(confirmDialog.length).toBe(1);
  });

  it('has the right layout', () => {
    expect(confirmDialog.find(`#${props.id}`).hasClass('modal')).toBe(true);
    expect(confirmDialog.find('.modal-content').length).toBe(1);
    expect(confirmDialog.find('.modal-footer').length).toBe(1);
    expect(confirmDialog.find('.modal-close').length).toBe(2);
  });

  it('has the right action buttons', () => {
    expect(confirmDialog.find('.yes-btn').text()).toEqual('Yes');
    expect(confirmDialog.find('.no-btn').text()).toEqual('No');
  });

  it('calls the onYesClick prop on clicking "Yes" button', () => {
    confirmDialog.find('.yes-btn').simulate('click');
    expect(confirmDialog.props().onYesClick.calledOnce).toBe(true);
  });

  it('calls the onNoClick prop on clicking "No" button', () => {
    confirmDialog.find('.no-btn').simulate('click');
    expect(confirmDialog.props().onNoClick.calledOnce).toBe(true);
  });
});
