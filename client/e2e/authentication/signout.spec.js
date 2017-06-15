import config from '../config';
import { getValidUser } from '../../../scripts/data-generator';

export default {
  'User should be signed out on request': (browser) => {
    const user = getValidUser();
    browser
      .url(config.url)
      .waitForElementVisible('#signup', config.waitFor)
      .setValue('#signup-name', user.name)
      .setValue('#signup-email', user.email)
      .setValue('#signup-password', user.password)
      .setValue('#signup-confirm-password', user.password)
      .click('.submit-signup')
      .waitForElementVisible('.avatar-small', config.waitFor)
      .moveToElement('.avatar-small', undefined, undefined)
      .waitForElementVisible('.account-menu', config.waitFor)
      .click('.signout')
      .waitForElementVisible('#signup', config.waitFor)
      .end();
  }
};
