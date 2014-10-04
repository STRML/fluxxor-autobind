'use strict';
var _ = require("lodash");

var FluxAutoBindMixin = function() {
  var propNames = Array.prototype.slice.call(arguments);
  return {
    componentWillMount: function() {
      var flux = this.props.flux || this.context.flux;
      var stores = flux.autoBind.getStoresForProps(propNames);
      _.each(stores, function(store) {
        store.on("change", this._setStateFromFlux);
      }, this);
    },

    componentWillUnmount: function() {
      var flux = this.props.flux || this.context.flux;
      var stores = flux.autoBind.getStoresForProps(propNames);
      _.each(stores, function(store) {
        store.removeListener("change", this._setStateFromFlux);
      }, this);
    },

    getInitialState: function() {
      return this._getStateFromFluxAutoBind();
    },

    _getStateFromFluxAutoBind: function() {
      var flux = this.props.flux || (this.context && this.context.flux);
      // This is called before componentWillMount so it's a good time to catch this.
      if (!flux) throw new Error("FluxAutoBindMixin must be used in combination with FluxMixin or FluxChildMixin.");
      return flux.autoBind.getPropsObject(propNames);
    },

    _setStateFromFlux: function() {
      if(this.isMounted()) {
        this.setState(this._getStateFromFluxAutoBind());
      }
    }
  };
};

// Throw an error when this mixin is used without invocation
FluxAutoBindMixin.componentWillMount = function() {
  throw new Error("FluxAutoBindMixin is a function that takes one or more " +
    "property names names as parameters and returns the mixin, e.g.: " +
    "mixins[Fluxxor.StoreWatchMixin(\"trades\", \"orderSubmissionStatus\")]." +
    "It requires that at least one property is aliased via the Store mixin, " +
    "FluxStoreAutoBind.");
};

module.exports = FluxAutoBindMixin;

