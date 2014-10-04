'use strict';
// Be sure to init jsdom before importing react, otherwise its DOM detection will fail.
var jsdom = require('jsdom');
var initDOM = function () {
  global.document = jsdom.jsdom('<html><body></body></html>');
  global.window = global.document.parentWindow;
  global.navigator = global.window.navigator;
};
var cleanDOM = function() {
  delete global.window;
  delete global.document;
  delete global.navigator;
};
initDOM();

module.exports = {
  init: initDOM,
  clean: cleanDOM
};
