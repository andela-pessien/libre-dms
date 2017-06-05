/* eslint global-require: "off"*/
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./production.config');
} else {
  module.exports = require('./development.config');
}
