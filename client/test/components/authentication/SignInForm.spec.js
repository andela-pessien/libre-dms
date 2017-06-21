import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { SignInForm } from '../../../components/authentication/SignInForm';
import { getValidUser } from '../../../../scripts/data-generator';

describe('SignInForm component', () => {
  let signInForm;
  const signInSpy = sinon.spy(() => new Promise(() => {}));

  beforeEach(() => {
    signInForm = shallow(<SignInForm signIn={signInSpy} />);
  });

  it('renders without crashing', () => {
    expect(signInForm.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(signInForm.find('.auth-form').length).toBe(1);
  });

  it('should have input fields for email and password', () => {
    expect(signInForm.find('input').length).toBe(2);
    expect(signInForm.find('#signin-email').length).toBe(1);
    expect(signInForm.find('#signin-password').length).toBe(1);
  });

  it('should have submit button', () => {
    expect(signInForm.find('button').length).toBe(1);
    expect(signInForm.find('button').text()).toEqual('Sign In');
  });
});

describe('SignInForm component', () => {
  let signInForm;
  const signInSpy = sinon.spy(() => {});

  beforeEach(() => {
    signInForm = mount(<SignInForm signIn={signInSpy} />);
    global.Materialize.toast = sinon.spy(() => {});
  });

  afterEach(() => {
    global.Materialize.toast = () => {};
  });

  it('should update state via onChange method', () => {
    const user = getValidUser();

    signInForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signInForm.instance().onChange({ target: { value: user.password, name: 'password' } });

    expect(signInForm.state('email')).toEqual(user.email);
    expect(signInForm.state('password')).toEqual(user.password);
  });

  it('should call onSubmit method on form submit', () => {
    const user = getValidUser();

    sinon.spy(signInForm.instance(), 'onSubmit');
    signInForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signInForm.instance().onChange({ target: { value: user.password, name: 'password' } });

    signInForm.find('.submit-signin').simulate('submit');
    expect(signInForm.instance().onSubmit.calledOnce).toEqual(true);
  });

  it('should display error if email or password is blank', () => {
    const user = getValidUser();

    sinon.spy(signInForm.instance(), 'onSubmit');
    signInForm.instance().onChange({ target: { value: '', name: 'email' } });
    signInForm.instance().onChange({ target: { value: user.password, name: 'password' } });

    signInForm.find('.submit-signin').simulate('submit');
    expect(signInForm.instance().onSubmit.calledOnce).toBe(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('No field should be left blank');
  });

  it('should display error if email is invalid', () => {
    const user = getValidUser();

    sinon.spy(signInForm.instance(), 'onSubmit');
    signInForm.instance().onChange({ target: { value: user.password, name: 'email' } });
    signInForm.instance().onChange({ target: { value: user.password, name: 'password' } });

    signInForm.find('.submit-signin').simulate('submit');
    expect(signInForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Please provide a valid email');
  });

  it('should display error if there was an error signing up', () => {
    sinon.spy(signInForm.instance(), 'componentWillReceiveProps');
    signInForm.setProps({ error: { message: 'Connection failed' } });
    expect(signInForm.instance().componentWillReceiveProps.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Connection failed');
  });

  it('should not display error if there was no error signing up', () => {
    sinon.spy(signInForm.instance(), 'componentWillReceiveProps');
    signInForm.setProps({ error: null });
    expect(signInForm.instance().componentWillReceiveProps.calledOnce).toEqual(true);
    expect(global.Materialize.toast.callCount).toBe(0);
  });
});
