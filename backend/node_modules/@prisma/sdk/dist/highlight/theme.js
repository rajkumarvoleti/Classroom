"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = exports.identity = exports.brightBlue = exports.blue = exports.darkBrightBlue = exports.gamboge = void 0;
const chalk_1 = __importDefault(require("chalk"));
// https://www.wnycstudios.org/story/211119-colors
exports.gamboge = chalk_1.default.rgb(228, 155, 15);
exports.darkBrightBlue = chalk_1.default.rgb(107, 139, 140);
exports.blue = chalk_1.default.cyan;
exports.brightBlue = chalk_1.default.rgb(127, 155, 175);
const identity = (str) => str || '';
exports.identity = identity;
exports.theme = {
    keyword: exports.blue,
    entity: exports.blue,
    value: exports.brightBlue,
    punctuation: exports.darkBrightBlue,
    directive: exports.blue,
    function: exports.blue,
    variable: exports.brightBlue,
    string: exports.brightBlue,
    boolean: exports.gamboge,
    comment: chalk_1.default.dim,
};
//# sourceMappingURL=theme.js.map