"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGlobalStyle = exports.withTheme = exports.theme = exports.ThemeProvider = exports.keyframes = exports.injectGlobal = exports.css = void 0;

var styledComponents = require("styled-components");

var theme_1 = require("./theme");

Object.defineProperty(exports, "theme", {
  enumerable: true,
  get: function get() {
    return theme_1.theme;
  }
});
var _a = styledComponents,
    styled = _a["default"],
    css = _a.css,
    injectGlobal = _a.injectGlobal,
    keyframes = _a.keyframes,
    ThemeProvider = _a.ThemeProvider,
    withTheme = _a.withTheme,
    createGlobalStyle = _a.createGlobalStyle;
exports.css = css;
exports.injectGlobal = injectGlobal;
exports.keyframes = keyframes;
exports.ThemeProvider = ThemeProvider;
exports.withTheme = withTheme;
exports.createGlobalStyle = createGlobalStyle;
exports["default"] = styled;