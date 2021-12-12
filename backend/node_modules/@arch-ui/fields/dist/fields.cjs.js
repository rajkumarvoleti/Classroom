'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./fields.cjs.prod.js");
} else {
  module.exports = require("./fields.cjs.dev.js");
}
