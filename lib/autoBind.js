'use strict';
var _ = require("lodash");

/**
 * Required for implementation of Fluxxor-AutoBind.
 */
var FluxAutoBindImpl = {
  /**
   * Mix AutoBind into flux.
   *
   * AutoBind is a Fluxxor addon with an accompanying view mixin that helps fix the complex wiring
   * of properties through intermediate components by allowing views to grab properties directly from
   * the underlying store and set them as component local state. That state is then automatically updated
   * whenever the store emits a 'change' event.
   *
   * You can use AutoBind as much or as little as you like to help with unruly wiring of props to deeply
   * nested child components. 
   * 
   * For example, when implementing a form, you may want to display a form status
   * text. It can be a real pain to create this property in a store, wire it into your top-level component,
   * change the output of `getStateFromFlux`, ensure the store is listed in `StoreWatchMixin` (careful!), 
   * and wire it down through every single intermediate component until you get back to your form component. 
   * 
   * Instead, with AutoBind + FluxAutoBindMixin, one simply needs to add the property to the store, 
   * and add the property to the parameters of FluxAutoBindMixin inside the form component. Intermediate
   * components do not need to be modified. 
   *
   * Properties received through AutoBind are perfectly safe to use as props of child components 
   *
   * @param  {Fluxxor} flux Flux object.
   * @return {Fluxxor}      Flux object.
   */
  install: function(flux) {
    if (!flux ||
      // Duck-type flux rather than include it as a dep.
      // Probably better to just as Fluxxor as a dep to this project.
      !flux.dispatcher || !flux.actions || !flux.stores) {
      throw new Error("FluxAutoBind.mixinToFlux() expects a Fluxxor.Flux instance to be passed as the only parameter.");
    }
    var autoBind = {
      // propName:store
      registeredProps: {},
      /**
       * Returns all stores affiliated with the given propNames.
       * @param  {Array} propNames Props to return stores for.
       * @return {Array}           Stores.
       */
      getStoresForProps: function(propNames) {
        return _(autoBind.registeredProps)
          .pick(propNames)
          .values()
          .uniq()
          .value();
      },
      /**
       * Get the autoBound prop value from a given name.
       * @param  {String} propName Property name.
       * @return {*}               The value stored at that name, on the registered store.
       */
      getProp: function(propName) {
        if (!autoBind.registeredProps[propName]) {
          throw new Error("Property is not registered to autoBind: " + propName);
        }
        return autoBind.registeredProps[propName][propName];
      },
      /**
       * An easy-to-use object containing property values keyed by their names.
       * Similar to a cursor but read-only.
       * @param  {Array} propNames Property names.
       * @return {Object}          Value object.
       */
      getPropsObject: function(propNames) {
        var values = _.map(propNames, autoBind.getProp);
        return _.zipObject(propNames, values);
      },
      /**
       * Registers a property with autobind. The name must be unique and equal to the property name
       * inside the store.
       * FIXME: Can we support namespacing here - where the property value on the store is different
       * than the autoBind name?
       * @param  {Store}  store    Flux store.
       * @param  {String} propName Property name. Must be equal to property name on the store.
       */
      registerProp: function(store, propName) {
        if (autoBind.registeredProps[propName]) {
          throw new Error("Property is already registered to autoBind: " + propName);
        }
        autoBind.registeredProps[propName] = store;
      }
    };
    flux.autoBind = autoBind;
    return flux;
  }
};

module.exports = FluxAutoBindImpl;

