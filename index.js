var Impl = require("./lib/autoBind"),
    Mixin = require("./lib/viewMixin");

module.exports = {
  install: Impl.install,
  Mixin: Mixin,
  version: require("./version")
};

