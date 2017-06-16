import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { AccountMenu } from '../../../components/common/AccountMenu';
import AccountMenuComp from '../../../components/common/AccountMenu';
import { getValidUser } from '../../../../scripts/data-generator';

const mockStore = configureMockStore([thunk]);

describe('AccountMenu component', () => {
  let accountMenu;
  const user = getValidUser();
  const store = mockStore({
    userReducer: {
      '9e73286e-82ad-433f-9637-71766692dc5d': {
        user
      }
    }
  });
  const props = {
    ownId: '9e73286e-82ad-433f-9637-71766692dc5d'
  };

  beforeEach(() => {
    accountMenu = mount(<Provider store={store}><AccountMenuComp {...props} /></Provider>);
  });

  it('renders without crashing', () => {
    expect(accountMenu.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(accountMenu.find('#nav-mobile').length).toBe(1);
    expect(accountMenu.find('#nav-mobile').hasClass('right')).toBe(true);
  });

  it('should display user\'s name', () => {
    expect(accountMenu.find('li > p').text()).toEqual(`Hi, ${user.name.split(' ')[0]}`);
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
    accountMenu.find('.signout').simulate('click');
  });

  it('should call signOut prop from onSignOutClick method on clicking "Sign Out', () => {
    const shallowProps = {
      user,
      signOut: sinon.spy(() => {})
    };
    accountMenu = mount(<AccountMenu {...shallowProps} />);
    accountMenu.find('.signout').simulate('click');
    expect(accountMenu.props().signOut.callCount).toBe(1);
  });
});
