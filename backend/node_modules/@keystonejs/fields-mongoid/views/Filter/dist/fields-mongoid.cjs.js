'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./fields-mongoid.cjs.prod.js");
} else {
  module.exports = require("./fields-mongoid.cjs.dev.js");
}
