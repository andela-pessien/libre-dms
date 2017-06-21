/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { jsdom } from 'jsdom';
import $ from 'jquery';

require.extensions['.css'] = () => (null);
require.extensions['.png'] = () => (null);
require.extensions['.jpg'] = () => (null);

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

$.prototype.dropdown = () => {};
$.prototype.modal = () => {};
$.prototype.tabs = () => {};
$.prototype.tooltip = () => {};
$.prototype.sideNav = () => {};
global.$ = $;
global.jQuery = $;
global.window.$ = $;
global.window.jQuery = $;

global.navigator = {
  userAgent: 'node.js'
};
global.Materialize = { toast: () => {} };
global.localStorage = {};
global.localStorage.getItem = key => global.localStorage[key];
global.localStorage.setItem = (key, value) => { global.localStorage[key] = value; };
global.localStorage.removeItem = (key) => { delete global.localStorage[key]; };

const documentRef = document;  // eslint-disable-line no-undef
