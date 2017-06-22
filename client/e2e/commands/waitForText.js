/**
 * This file is written using ES5 object-oriented syntax because Nightwatch/Selenium does
 * not yet support ES6 classes for commands.
 * Efforts to rewrite as an ES6 class proved abortive.
 * See: https://github.com/nightwatchjs/nightwatch/issues/1199
 * @author proclaim (https://gist.github.com/proclaim/7a242f7d4d7aa7cb0ec352beb3a3429c)
 */
const util = require('util');
const events = require('events');

/**
 * Creates WaitForText object
 * @returns {undefined}
 */
function WaitForText() {
  events.EventEmitter.call(this);
}

util.inherits(WaitForText, events.EventEmitter);

WaitForText.prototype.command = function command(selector, expectedText, timeoutInSec, callback) {
  const self = this,
    timeoutRetryInMilliseconds = 100,
    startTimeInMilliseconds = new Date().getTime();

  if (!timeoutInSec) return this;

  const checker = (_selector, _expectedText, _timeoutInMilliseconds) => {
    this.client.api.getText(selector, (result) => {
      const now = new Date().getTime();
      if (result.status === 0 && expectedText === result.value) {
        self.client.api.assert.containsText(selector, expectedText);
        if (typeof callback === 'function') {
          callback.call(this);
        }
        self.emit('complete');
      } else if (now - startTimeInMilliseconds < _timeoutInMilliseconds) {
        setTimeout(() => {
          checker(_selector, _expectedText, _timeoutInMilliseconds);
        }, timeoutRetryInMilliseconds);
      } else {
        self.emit('error', `expect ${_expectedText} but got ${result.value}`);
      }
    });
  };

  checker(selector, expectedText, timeoutInSec * 1000);
};

module.exports = WaitForText;
