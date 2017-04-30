/* eslint global-require: "off"*/
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureProd');
} else {
  module.exports = require('./configureDev');
}
