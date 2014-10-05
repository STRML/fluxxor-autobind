/**
 * @jsx React.DOM
 */
'use strict';
var React             = require('react/addons');
var Fluxxor           = require('fluxxor');
var FluxMixin         = Fluxxor.FluxMixin(React);
var FluxChildMixin    = Fluxxor.FluxChildMixin(React);
var AutoBind          = require('fluxxor-autobind');

// Thanks markdownify
document.getElementById('container').innerHTML = require('./README.md');
var liveDemoHeader = document.getElementById('live-demo');
var liveDemo = document.createElement('div');
liveDemo.id = 'live-demo-container';
liveDemoHeader.parentNode.insertBefore(liveDemo, liveDemoHeader.nextSibling);

var App = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <div className="app">
        App Component
        <ParentComponent /> 
      </div>
    );
  }
});


var ParentComponent = React.createClass({
  render: function() {
    return (
      <div className="parentComponent">
        Parent Component
        <ChildComponent />
      </div>
    );
  }
});

var ChildComponent = React.createClass({
  render: function() {
    return (
      <div className="childComponent">
        Child Component
        <NestedChildComponent />
      </div>
    );
  }
});

var NestedChildComponent = React.createClass({
  mixins: [FluxChildMixin, AutoBind.Mixin('theTime')],
  render: function() {
    return (
      <div className="nestedChildComponent">
        Nested Child Component<br />
        {this.state.theTime}
      </div>
    );
  }
});

var TimeStore = Fluxxor.createStore({
  autoBind: ['theTime'],
  initialize: function() {
    this.theTime = new Date().toString();
    setInterval(function() {
      this.theTime = new Date().toString();
      this.emit('change');
    }.bind(this), 1000);
  }
});

var stores = {
  timeStore: new TimeStore()  
};

var flux = new Fluxxor.Flux(stores, {});
AutoBind.install(flux);
React.renderComponent(<App flux={flux} />, liveDemo);
