/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { SpecReporter } from 'jasmine-spec-reporter';
import { jsdom } from 'jsdom';

require.extensions['.css'] = () => (null);
require.extensions['.png'] = () => (null);
require.extensions['.jpg'] = () => (null);

const specReporter = new SpecReporter({
  spec: {
    displayPending: true
  }
});

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(specReporter);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
global.Materialize = { toast: () => {} };
global.localStorage = {
  setItem: () => {},
  removeItem: () => {},
};

const documentRef = document;  // eslint-disable-line no-undef
