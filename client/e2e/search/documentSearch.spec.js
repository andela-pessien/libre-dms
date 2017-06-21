import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'User should be able to search for documents': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('#public-button', config.waitFor)
      .click('#public-button')
      .waitForElementVisible('.search-input > input', config.waitFor)
      .setValue('.search-input > input', 'timize')
      .pause(2000)
      .assert.containsText('.feed > ul > div > li > h5 > a', 'timize')
      .end();
  }
};
