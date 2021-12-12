"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printConfigWarnings = void 0;
const chalk_1 = __importDefault(require("chalk"));
function printConfigWarnings(warnings) {
    if (warnings && warnings.length > 0) {
        const message = warnings
            .map((warning) => `${chalk_1.default.yellow('warn')} ${warning}`)
            .join('\n');
        console.warn(message);
    }
}
exports.printConfigWarnings = printConfigWarnings;
//# sourceMappingURL=printConfigWarnings.js.map