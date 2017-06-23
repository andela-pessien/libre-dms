import config from '../config';
import { getValidUser, getValidDoc } from '../../../scripts/data-generator';

export default {
  'User should be able to update document successfully': (browser) => {
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
      .moveToElement('.avatar-small', undefined, undefined)
      .waitForElementVisible('.account-menu', config.waitFor)
      .click('.signout')
      .waitForElementVisible('#signup', config.waitFor)
      .click('.signin-tab')
      .waitForElementVisible('#signin', config.waitFor)
      .setValue('#signin-email', user.email)
      .setValue('#signin-password', user.password)
      .click('.submit-signin')
      .waitForElementVisible('.own-feed > .feed > ul', config.waitFor)
      .click('.truncate')
      .waitForElementVisible('.ql-editor', config.waitFor)
      .execute((doc) => {
        $('.ql-editor > p').html(doc.content);
      }, [document])
      .waitForText('.status-span', 'All changes saved to cloud', config.waitFor)
      .click('.main-close')
      .pause(1000)
      .click('.truncate')
      .waitForElementVisible('.ql-editor', config.waitFor)
      .assert.valueContains('.title-editor', document.title)
      .assert.containsText('.ql-editor > p', document.content.substr(0, 100))
      .end();
  }
};
