'use strict';
// Init DOM *before* React
var DOM = require('../fixtures/DOM');
var AutoBind = require("../../");
var React = require('react');
var Fluxxor = require('fluxxor');
var stores = require('../fixtures/stores');
require('node-jsx').install();
var components = require('../fixtures/components');
var chai = require("chai");
var expect = chai.expect;


describe("AutoBind Installation", function() {
  it("installs without error", function() {
    var flux = new Fluxxor.Flux({}, {});
    AutoBind.install(flux);
    expect(flux.autoBind).to.be.an('object');
  });

  it("registers properties in 'autoBind' array on stores", function() {
    var timeStore = new stores.TimeStore();
    var flux = new Fluxxor.Flux({
      timeStore: timeStore
    }, {});
    AutoBind.install(flux);
    expect(flux.autoBind.getProp('theTime')).to.equal(timeStore.theTime);
  });

  it("throws an error when attempting to double-bind a property", function() {
    var flux = new Fluxxor.Flux({
      timeStore: new stores.TimeStore(),
      timeStore2: new stores.TimeStore()
    }, {});
    expect(function(){AutoBind.install(flux);}).to.throw(/already registered/);
  });
});

describe("AutoBind View Mixin", function() {
  beforeEach(function() {
    DOM.init();
  });

  afterEach(function() {
    DOM.clean();
  });

  it("Properly updates `state` when store updates when using AutoBindMixin.", function(done) {
    var timeStore = new stores.TimeStore();
    var flux = new Fluxxor.Flux({
      timeStore: timeStore
    }, {});
    AutoBind.install(flux);

    var container = global.document.createElement('div');
    var app = React.renderComponent(new components.App({flux: flux}), container);
    // It's pretty down there.
    var nested = app.refs.child.refs.child.refs.child;

    // TimeStore is updating every 1ms. Ensure that it and the component's state are in sync.    
    var checks = 3, thisCheck = 0, old;
    check();
    var interval = setInterval(function() {
      check();
      if(++thisCheck >= checks) {
        clearInterval(interval);
        React.unmountComponentAtNode(container);
        done();
      }
    }, 16);

    function check() {
      expect(nested.state.theTime).not.to.equal(old);
      expect(nested.state.theTime).to.equal(timeStore.theTime);
      old = nested.state.theTime;
    }
  });
});
