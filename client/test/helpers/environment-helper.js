/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { jsdom } from 'jsdom';

require.extensions['.css'] = () => (null);
require.extensions['.png'] = () => (null);
require.extensions['.jpg'] = () => (null);

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
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {},
};
// global.localStorage = {};
// global.localStorage.getItem = key => global.localStorage[key];
// global.localStorage.setItem = (key, value) => { global.localStorage[key] = value; };
// global.localStorage.removeItem = (key) => { delete global.localStorage[key]; };

const documentRef = document;  // eslint-disable-line no-undef
