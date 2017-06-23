import config from '../config';
import { getValidUser, getValidDoc } from '../../../scripts/data-generator';

export default {
  'User should be able to create document successfully': (browser) => {
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
      .click('.feed > ul > div > li > h5 > a')
      .pause(1000)
      .assert.valueContains('.title-editor', document.title)
      .end();
  },

  'Title should default to first few words if none is provided': (browser) => {
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
      .waitForElementVisible('.ql-editor', config.waitFor)
      .execute((doc) => {
        $('.ql-editor > p').html(doc.content);
      }, [document])
      .waitForElementVisible('.status-span', config.waitFor)
      .pause(config.waitFor)
      .assert.containsText('.feed > ul > div > li > h5 > a',
        document.content.substr(0, 20).replace(/\s+/g, ' '))
      .click('.main-close')
      .click('.feed > ul > div > li > h5 > a')
      .waitForElementVisible('.ql-editor', config.waitFor)
      .assert.valueContains('.title-editor',
        document.content.substr(0, 20).replace(/\s+/g, ' '))
      .end();
  }
};
