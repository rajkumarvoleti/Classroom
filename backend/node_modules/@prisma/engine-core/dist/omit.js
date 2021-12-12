"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = void 0;
/**
 * Omit key-value pairs from object.
 * @param obj Object to omit key-value pairs from
 * @param keys Keys to omit
 */
function omit(obj, keys) {
    return Object.keys(obj)
        .filter((key) => !keys.includes(key))
        .reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}
exports.omit = omit;
//# sourceMappingURL=omit.js.map