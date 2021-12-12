"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightTS = exports.highlightSql = exports.highlightDatamodel = void 0;
const prism_1 = require("./prism");
const dml_1 = require("./languages/dml");
const sql_1 = require("./languages/sql");
function highlightDatamodel(str) {
    return highlight(str, dml_1.dml);
}
exports.highlightDatamodel = highlightDatamodel;
function highlightSql(str) {
    return highlight(str, sql_1.sql);
}
exports.highlightSql = highlightSql;
function highlightTS(str) {
    return highlight(str, prism_1.Prism.languages.javascript);
}
exports.highlightTS = highlightTS;
function highlight(str, grammar) {
    const tokens = prism_1.Prism.tokenize(str, grammar);
    return tokens.map((t) => prism_1.Token.stringify(t)).join('');
}
//# sourceMappingURL=highlight.js.map