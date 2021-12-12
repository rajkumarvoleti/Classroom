"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawBox = void 0;
const chalk_1 = __importDefault(require("chalk"));
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const string_width_1 = __importDefault(require("string-width"));
const chars = {
    topLeft: '┌',
    topRight: '┐',
    bottomRight: '┘',
    bottomLeft: '└',
    vertical: '│',
    horizontal: '─',
};
function maxLineLength(str) {
    return (str.split('\n').reduce((max, curr) => Math.max(max, string_width_1.default(curr)), 0) +
        2);
}
function drawBox({ title, width, height, str, horizontalPadding, }) {
    horizontalPadding = horizontalPadding || 0;
    width = width || maxLineLength(str) + horizontalPadding * 2;
    const topLine = title
        ? chalk_1.default.grey(chars.topLeft + chars.horizontal) +
            ' ' +
            chalk_1.default.reset.bold(title) +
            ' ' +
            chalk_1.default.grey(chars.horizontal.repeat(width - title.length - 2 - 3) + chars.topRight) +
            chalk_1.default.reset()
        : chalk_1.default.grey(chars.topLeft + chars.horizontal) +
            chalk_1.default.grey(chars.horizontal.repeat(width - 3) + chars.topRight);
    const bottomLine = chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight;
    const lines = str.split('\n');
    if (lines.length < height) {
        lines.push(...new Array(height - lines.length).fill(''));
    }
    const mappedLines = lines
        .slice(-height)
        .map((l) => {
        const lineWidth = Math.min(string_width_1.default(l), width);
        const paddingRight = Math.max(width - lineWidth - 2, 0);
        return `${chalk_1.default.grey(chars.vertical)}${' '.repeat(horizontalPadding)}${chalk_1.default.reset(cli_truncate_1.default(l, width - 2))}${' '.repeat(paddingRight - horizontalPadding)}${chalk_1.default.grey(chars.vertical)}`;
    })
        .join('\n');
    return chalk_1.default.grey(topLine + '\n' + mappedLines + '\n' + bottomLine);
}
exports.drawBox = drawBox;
//# sourceMappingURL=drawBox.js.map