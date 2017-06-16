import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { AccountMenu } from '../../../components/common/AccountMenu';
import { getValidUser } from '../../../../scripts/data-generator';

describe('AccountMenu component', () => {
  let accountMenu;
  const props = {
    user: getValidUser(),
    signOut: sinon.spy(() => {})
  };

  beforeEach(() => {
    accountMenu = shallow(<AccountMenu {...props} />);
  });

  it('renders without crashing', () => {
    expect(accountMenu.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(accountMenu.find('#nav-mobile').length).toBe(1);
    expect(accountMenu.find('#nav-mobile').hasClass('right')).toBe(true);
  });

  it('should display user\'s name', () => {
    expect(accountMenu.find('li > p').text()).toEqual(`Hi, ${props.user.name.split(' ')[0]}`);
  });

  it('should display avatar icon', () => {
    expect(accountMenu.find('i.material-icons').text()).toEqual('person');
  });

  it('should display signout dropdown', () => {
    expect(accountMenu.find('#account-dropdown').length).toBe(1);
    expect(accountMenu.find('div')
      .filterWhere(item => (item.prop('data-activates') === 'account-dropdown'))
      .length).toBe(1);
    expect(accountMenu.find('.signout').text()).toEqual('Sign Out');
  });
});

describe('AccountMenu component', () => {
  let accountMenu;
  const props = {
    user: getValidUser(),
    signOut: sinon.spy(() => {})
  };

  beforeEach(() => {
    accountMenu = mount(<AccountMenu {...props} />);
  });

  it('should call signOut prop from onSignOutClick method on clicking "Sign Out', () => {
    accountMenu.find('.signout').simulate('click');
    expect(accountMenu.props().signOut.calledOnce).toBe(true);
  });
});
