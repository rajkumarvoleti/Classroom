"use strict";
/**
 *
 * utils
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
/** @private */
function isObject(val) {
    return typeof val === 'object' && val !== null;
}
exports.isObject = isObject;
