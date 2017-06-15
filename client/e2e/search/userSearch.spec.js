import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'User should be able to search for users': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('#people-button', config.waitFor)
      .click('#people-button')
      .waitForElementVisible('.search-input > input', config.waitFor)
      .setValue('.search-input > input', user.name)
      .pause(2000)
      .assert.containsText('.feed > ul > div > li > h5 > a', user.name)
      .end();
  }
};
