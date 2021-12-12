"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigString = exports.getHistoryOpen = exports.getFixedEndpoint = void 0;

var makeGeneralSelector = function makeGeneralSelector(key) {
  return function (state) {
    return state.general.get(key);
  };
};

exports.getFixedEndpoint = makeGeneralSelector('fixedEndpoint');
exports.getHistoryOpen = makeGeneralSelector('historyOpen');
exports.getConfigString = makeGeneralSelector('configString');