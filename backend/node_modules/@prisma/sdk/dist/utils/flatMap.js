"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = void 0;
function flatten(array) {
    return Array.prototype.concat.apply([], array);
}
function flatMap(array, callbackFn, thisArg) {
    return flatten(array.map(callbackFn, thisArg));
}
exports.flatMap = flatMap;
//# sourceMappingURL=flatMap.js.map