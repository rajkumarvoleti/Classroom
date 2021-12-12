"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCi = void 0;
const is_ci_1 = require("is-ci");
const isCi = () => {
    return !process.stdout.isTTY || is_ci_1.isCi || Boolean(process.env.GITHUB_ACTIONS);
};
exports.isCi = isCi;
//# sourceMappingURL=isCi.js.map