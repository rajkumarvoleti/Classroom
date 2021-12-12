"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
const terminal_link_1 = __importDefault(require("terminal-link"));
const chalk_1 = __importDefault(require("chalk"));
function link(url) {
    return terminal_link_1.default(url, url, {
        fallback: (url) => chalk_1.default.underline(url),
    });
}
exports.link = link;
//# sourceMappingURL=link.js.map