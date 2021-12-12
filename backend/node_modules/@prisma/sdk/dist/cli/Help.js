"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpError = exports.unknownCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Unknown command
 */
function unknownCommand(helpTemplate, cmd) {
    return new HelpError(`\n${chalk_1.default.bold.red(`!`)} Unknown command "${cmd}"\n${helpTemplate}`);
}
exports.unknownCommand = unknownCommand;
/**
 * Custom help error used to display help
 * errors without printing a stack trace
 */
class HelpError extends Error {
    constructor(msg) {
        super(msg);
        // setPrototypeOf is needed for custom errors to work
        Object.setPrototypeOf(this, HelpError.prototype);
    }
}
exports.HelpError = HelpError;
//# sourceMappingURL=Help.js.map