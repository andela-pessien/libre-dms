import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'Signup with invalid name should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', '   ')
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'No field should be left blank');
  },

  'Signup with invalid email should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.name)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Please provide a valid email');
  },

  'Signup with email already in use should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', process.env.SADMIN_EMAIL)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Someone has already signed up with that email');
  },

  'Signup with invalid password should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password.substr(0, 5))
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Please choose a longer password');
  },

  'Signup with unconfirmed password should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password.substr(0, 5))
      .click('.submit-signup')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Passwords don\'t match!');
  },

  'Signup with valid details should pass': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.main-wrapper', config.waitFor)
      .end();
  }
};
