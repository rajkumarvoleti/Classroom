"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyBy = void 0;
/**
 * Reduce over the keys of the iterable.
 * @param collection Any array-like data structure.
 * @param iteratee Callback to be called on every element.
 */
const keyBy = (collection, iteratee) => {
    return collection.reduce((acc, curr) => {
        acc[iteratee(curr)] = curr;
        return acc;
    }, {});
};
exports.keyBy = keyBy;
//# sourceMappingURL=keyBy.js.map