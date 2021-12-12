"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimBlocksFromSchema = exports.trimNewLine = void 0;
function trimNewLine(str) {
    if (str === '') {
        return str;
    }
    let newStr = str;
    if (/\r?\n|\r/.exec(newStr[0])) {
        newStr = newStr.slice(1);
    }
    if (newStr.length > 0 && /\r?\n|\r/.exec(newStr[newStr.length - 1])) {
        newStr = newStr.slice(0, newStr.length - 1);
    }
    return newStr;
}
exports.trimNewLine = trimNewLine;
function trimBlocksFromSchema(str, blocks = ['model', 'enum', 'datasource', 'generator']) {
    const lines = str.split('\n');
    if (lines.length <= 2) {
        return str;
    }
    const modelPositions = [];
    let blockOpen = false;
    let currentStart = -1;
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (blocks.some((b) => line.startsWith(b)) && line.endsWith('{')) {
            blockOpen = true;
            currentStart = index;
        }
        if (trimmed.endsWith('}') && currentStart > -1 && blockOpen) {
            modelPositions.push({
                start: currentStart,
                end: index,
            });
            blockOpen = false;
            currentStart = -1;
        }
    });
    if (modelPositions.length === 0) {
        return str;
    }
    return trimNewLine(modelPositions
        .reduceRight((acc, position) => {
        acc.splice(position.start, position.end - position.start + 1);
        return acc;
    }, lines)
        .join('\n'));
}
exports.trimBlocksFromSchema = trimBlocksFromSchema;
//# sourceMappingURL=trimBlocksFromSchema.js.map