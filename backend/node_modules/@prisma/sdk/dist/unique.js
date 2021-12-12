"use strict";
/**
 * Returns unique elements of array
 * @param arr Array
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = void 0;
function unique(arr) {
    const { length } = arr;
    const result = [];
    const seen = new Set(); // just a cache
    loop: for (let i = 0; i < length; i++) {
        const value = arr[i];
        if (seen.has(value)) {
            continue loop;
        }
        seen.add(value);
        result.push(value);
    }
    return result;
}
exports.unique = unique;
//# sourceMappingURL=unique.js.map