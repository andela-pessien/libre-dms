/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount } from 'enzyme';
import MobileMenuButton from '../../../components/common/MobileMenuButton';

describe('MobileMenuButton component', () => {
  let menuButton;

  beforeEach(() => {
    menuButton = mount(<MobileMenuButton />);
  });

  it('renders without crashing', () => {
    expect(menuButton.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(menuButton.find('.button-collapse')
      .filterWhere(item => (item.prop('data-activates') === 'mobile-side-menu'))
      .length).toBe(1);
    expect(menuButton.find('.material-icons').text()).toEqual('menu');
  });
});
