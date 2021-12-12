"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
function pick(obj, keys) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (keys.includes(key)) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
exports.pick = pick;
//# sourceMappingURL=pick.js.map