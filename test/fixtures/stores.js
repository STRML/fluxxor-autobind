'use strict';

var Fluxxor = require('fluxxor');

var TimeStore = Fluxxor.createStore({
  autoBind: ['theTime'],
  initialize: function() {
    this.theTime = Date.now();
    setInterval(function() {
      this.theTime = Date.now();
      this.emit('change');
    }.bind(this), 1);
  }
});

module.exports = {
  TimeStore: TimeStore
};
