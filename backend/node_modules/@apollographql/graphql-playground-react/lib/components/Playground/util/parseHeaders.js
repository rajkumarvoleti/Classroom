"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHeaders = void 0;

function parseHeaders(headers) {
  if (!headers) {
    return {};
  }

  try {
    return JSON.parse(headers);
  } catch (e) {
    return {};
  }
}

exports.parseHeaders = parseHeaders;