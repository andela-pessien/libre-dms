import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'User should be able to view document successfully': (browser) => {
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
      .waitForElementVisible('.public-feed > .feed > ul', config.waitFor)
      .click('.truncate')
      .waitForElementVisible('.title-editor', config.waitFor)
      .waitForElementVisible('.content-editor', config.waitFor)
      .pause(500)
      .execute(() => $('.truncate').html(), [], ({ value }) => {
        browser.assert.valueContains('.title-editor',
          value.substr(0, 15));
      })
      .end();
  }
};
