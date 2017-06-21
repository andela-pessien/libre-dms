import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'Signin with empty email should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', '  ')
      .setValue('#signin-password', user.password)
      .click('.submit-signin')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'No field should be left blank')
      .end();
  },

  'Signin with empty password should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', user.email)
      .setValue('#signin-password', '  ')
      .click('.submit-signin')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'No field should be left blank')
      .end();
  },

  'Signin with invalid email should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', user.name)
      .setValue('#signin-password', user.password)
      .click('.submit-signin')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Please provide a valid email')
      .end();
  },

  'Signin with unregistered user should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', user.email)
      .setValue('#signin-password', user.password)
      .click('.submit-signin')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'No user with that email exists')
      .end();
  },

  'Signin with invalid credentials should fail': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', process.env.SADMIN_EMAIL)
      .setValue('#signin-password', user.password)
      .click('.submit-signin')
      .waitForElementVisible('.toast', config.waitFor)
      .assert.containsText('.toast', 'Failed to authenticate with provided credentials')
      .end();
  },

  'Signin with valid credentials should pass': (browser) => {
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', process.env.SADMIN_EMAIL)
      .setValue('#signin-password', process.env.SADMIN_PASSWORD)
      .click('.submit-signin')
      .waitForElementVisible('.single-page-wrapper', config.waitFor)
      .end();
  }
};
