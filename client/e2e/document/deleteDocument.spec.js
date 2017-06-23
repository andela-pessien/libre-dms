import config from '../config';
import { getValidUser, getValidDoc } from '../../../scripts/data-generator';

export default {
  'User should be able to delete own documents': (browser) => {
    const user = getValidUser();
    const document = getValidDoc();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.new-doc', config.waitFor)
      .click('.new-doc')
      .waitForElementVisible('.title-editor', config.waitFor)
      .setValue('.title-editor', document.title)
      .waitForElementVisible('.status-span', config.waitFor)
      .waitForText('.status-span', 'All changes saved to cloud', config.waitFor)
      .pause(config.waitFor)
      .assert.containsText('.feed > ul > div > li > h5 > a', document.title)
      .click('.delete-button')
      .waitForElementVisible('#confirm-document-delete', config.waitFor)
      .waitForElementVisible('.yes-btn', config.waitFor)
      .pause(500)
      .click('.yes-btn')
      .waitForElementVisible('.own-feed > .feed > h5', 2 * config.waitFor)
      .assert.containsText('.own-feed > .feed > h5', 'No documents to display')
      .end();
  },

  'Superadministrator should be able to delete documents': (browser) => {
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', process.env.SADMIN_EMAIL)
      .setValue('#signin-password', process.env.SADMIN_PASSWORD)
      .click('.submit-signin')
      .waitForElementVisible('#public-button', config.waitFor)
      .click('#public-button')
      .waitForElementVisible('.public-feed > .feed > ul', config.waitFor)
      .pause(500)
      .getText('.feed > ul > div:nth-child(even) > li > h5 > a', ({ value }) => {
        browser
          .click('.truncate')
          .waitForElementVisible('.title-editor', config.waitFor)
          .waitForElementVisible('.delete-button', config.waitFor)
          .click('.delete-button')
          .waitForElementVisible('#confirm-document-delete', config.waitFor)
          .waitForElementVisible('.yes-btn', config.waitFor)
          .pause(500)
          .click('.yes-btn')
          .pause(2 * config.waitFor)
          .assert.containsText('.truncate', value)
          .end();
      });
  }
};
