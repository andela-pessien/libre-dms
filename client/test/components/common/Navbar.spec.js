import React from 'react';
/* eslint-disable react/jsx-filename-extension */
import { shallow } from 'enzyme';
import Navbar from '../../../components/common/Navbar';

describe('Navbar component', () => {
  let navbar;

  beforeEach(() => {
    navbar = shallow(<Navbar />);
  });

  it('renders without crashing', () => {
    expect(navbar.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(navbar.find('.app-navbar').length).toBe(1);
    expect(navbar.find('.nav-wrapper').length).toBe(1);
  });

  it('should display app name', () => {
    expect(navbar.find('.brand-logo').text()).toEqual('LibreDMS');
  });
});
