"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.arg = exports.format = void 0;
const strip_indent_1 = __importDefault(require("strip-indent"));
const arg_1 = __importDefault(require("arg"));
/**
 * format
 */
function format(input = '') {
    return strip_indent_1.default(input).trimRight() + '\n';
}
exports.format = format;
/**
 * Wrap arg to return an error instead of throwing
 */
function arg(argv, spec, stopAtPositional = true, permissive = false) {
    try {
        return arg_1.default(spec, { argv, stopAtPositional, permissive });
    }
    catch (err) {
        return err;
    }
}
exports.arg = arg;
/**
 * Check if result is an error
 */
function isError(result) {
    return result instanceof Error;
}
exports.isError = isError;
//# sourceMappingURL=utils.js.map