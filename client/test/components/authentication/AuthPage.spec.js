import React from 'react';
import { shallow } from 'enzyme';
import AuthPage from '../../../components/authentication/AuthPage';

describe('AuthPage component', () => {
  let authPage;

  beforeEach(() => {
    authPage = shallow(<AuthPage />);
  });

  it('renders without crashing', () => {
    expect(authPage.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(authPage.find('.auth-page-wrapper').length).toBe(1);
    expect(authPage.find('.row').length).toBe(1);
    expect(authPage.find('.l7').length).toBe(1);
  });

  it('should display logo', () => {
    expect(authPage.find('.logo-image').length).toBe(1);
    expect(authPage.find('img')
      .filterWhere(item => (item.prop('alt') === 'logo'))
      .length).toBe(1);
  });
});
