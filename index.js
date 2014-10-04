/**
 * @jsx React.DOM
 */
'use strict';
var React             = require('react/addons');
var Fluxxor           = require('fluxxor');
var FluxMixin         = Fluxxor.FluxMixin(React);
var FluxChildMixin    = Fluxxor.FluxChildMixin(React);
var AutoBind          = require('fluxxor-autobind');

var App = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <div className="app">
        App component
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
        NestedChildComponent<br />
        {this.state.theTime}
      </div>
    );
  }
});

var TimeStore = Fluxxor.createStore({
  actions: {
    'FLUX_INIT': 'onFluxInit',
  },
  initialize: function() {
    this.theTime = new Date().toString();
    setInterval(function() {
      this.theTime = new Date().toString();
      this.emit('change');
    }.bind(this), 1000);
  },
  onFluxInit: function() {
    // Unfortunately we have to wait for flux to actually exist in order to register this
    this.flux.autoBind.registerProp(this, 'theTime');
  }
});

var stores = {
  timeStore: new TimeStore()  
};

var actions = {
  fluxInit: function() {
    this.dispatch("FLUX_INIT", {});
  }
};

var flux = new Fluxxor.Flux(stores, actions);
AutoBind.install(flux);
flux.actions.fluxInit(); // lame
React.renderComponent(<App flux={flux} />, document.body);
