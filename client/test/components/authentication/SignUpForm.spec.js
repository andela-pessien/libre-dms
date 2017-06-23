/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { SignUpFormComponent } from '../../../components/authentication/SignUpForm';
import { getValidUser } from '../../../../scripts/data-generator';

describe('SignUpForm component', () => {
  let signUpForm;
  const signUpSpy = sinon.spy(() => new Promise(() => {}));

  beforeEach(() => {
    signUpForm = shallow(<SignUpFormComponent signUp={signUpSpy} />);
  });

  it('renders without crashing', () => {
    expect(signUpForm.length).toBe(1);
  });

  it('should have the right layout', () => {
    expect(signUpForm.find('.auth-form').length).toBe(1);
  });

  it('should have input fields for name, email, password and confirming password', () => {
    expect(signUpForm.find('input').length).toBe(4);
    expect(signUpForm.find('#signup-name').length).toBe(1);
    expect(signUpForm.find('#signup-email').length).toBe(1);
    expect(signUpForm.find('#signup-password').length).toBe(1);
    expect(signUpForm.find('#signup-confirm-password').length).toBe(1);
  });

  it('should have submit button', () => {
    expect(signUpForm.find('button').length).toBe(1);
    expect(signUpForm.find('button').text()).toEqual('Sign Up');
  });
});

describe('SignUpForm component', () => {
  let signUpForm;
  const signUpSpy = sinon.spy(() => {});

  beforeEach(() => {
    signUpForm = mount(<SignUpFormComponent signUp={signUpSpy} />);
    global.Materialize.toast = sinon.spy(() => {});
  });

  afterEach(() => {
    global.Materialize.toast = () => {};
  });

  it('should update state via onChange method', () => {
    const user = getValidUser();

    signUpForm.instance().onChange({ target: { value: user.name, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    expect(signUpForm.state('name')).toEqual(user.name);
    expect(signUpForm.state('email')).toEqual(user.email);
    expect(signUpForm.state('password')).toEqual(user.password);
    expect(signUpForm.state('confirmPassword')).toEqual(user.password);
  });

  it('should call onSubmit method on form submit', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.name, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
  });

  it('should display error if any field is blank', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('No field should be left blank');
  });

  it('should display error if email is invalid', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.name, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.name, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Please provide a valid email');
  });

  it('should display error if name is invalid', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.email, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Please provide a valid first and last name');
  });

  it('should display error if password is too short', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.name, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target:
      { value: user.password.substr(0, 3), name: 'password' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Please choose a longer password');
  });

  it('should display error if password is unconfirmed', () => {
    const user = getValidUser();

    sinon.spy(signUpForm.instance(), 'onSubmit');
    signUpForm.instance().onChange({ target: { value: user.name, name: 'name' } });
    signUpForm.instance().onChange({ target: { value: user.email, name: 'email' } });
    signUpForm.instance().onChange({ target: { value: user.password, name: 'password' } });
    signUpForm.instance().onChange({ target:
      { value: user.password.substr(0, 5), name: 'confirmPassword' } });

    signUpForm.find('.submit-signup').simulate('submit');
    expect(signUpForm.instance().onSubmit.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual("Passwords don't match!");
  });

  it('should display error if there was an error signing up', () => {
    sinon.spy(signUpForm.instance(), 'componentWillReceiveProps');
    signUpForm.setProps({ error: { message: 'Connection failed' } });
    expect(signUpForm.instance().componentWillReceiveProps.calledOnce).toEqual(true);
    expect(global.Materialize.toast.calledOnce).toBe(true);
    expect(global.Materialize.toast.getCall(0).args[0])
      .toEqual('Connection failed');
  });

  it('should not display error if there was no error signing up', () => {
    sinon.spy(signUpForm.instance(), 'componentWillReceiveProps');
    signUpForm.setProps({ error: null });
    expect(signUpForm.instance().componentWillReceiveProps.calledOnce).toEqual(true);
    expect(global.Materialize.toast.callCount).toBe(0);
  });
});
