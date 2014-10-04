/** @jsx React.DOM */

'use strict';
var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React);
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var AutoBind = require("../../");

var App = React.createClass({
  mixins: [FluxMixin],
  render: function() {
    return (
      <div className="app">
        App component
        <ParentComponent ref="child"/> 
      </div>
    );
  }
});

var ParentComponent = React.createClass({
  render: function() {
    return (
      <div className="parentComponent">
        Parent Component
        <ChildComponent ref="child"/>
      </div>
    );
  }
});

var ChildComponent = React.createClass({
  render: function() {
    return (
      <div className="childComponent">
        Child Component
        <NestedChildComponent ref="child"/>
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
        <span ref="theTime">{this.state.theTime}</span>
      </div>
    );
  }
});

module.exports = {
  App: App,
  ParentComponent: ParentComponent,
  ChildComponent: ChildComponent,
  NestedChildComponent: NestedChildComponent
};
