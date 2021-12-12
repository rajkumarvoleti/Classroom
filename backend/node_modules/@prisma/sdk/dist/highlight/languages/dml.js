"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dml = void 0;
exports.dml = {
    string: [/\"(.*)\"/g, /\'(.*)\'/g],
    directive: { pattern: /(@.*)/g },
    entity: [
        /model\s+\w+/g,
        /enum\s+\w+/g,
        /datasource\s+\w+/g,
        /source\s+\w+/g,
        /generator\s+\w+/g,
    ],
    comment: /#.*/g,
    value: [/\b\s+(\w+)/g],
    punctuation: /(\:|}|{|"|=)/g,
    boolean: /(true|false)/g,
};
//# sourceMappingURL=dml.js.map