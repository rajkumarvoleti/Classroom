"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDate = exports.timestampToDate = exports.now = void 0;
const prefixZero = (value) => ('0' + value).slice(-2);
function now() {
    const now = new Date();
    return `${now.getFullYear()}${prefixZero(now.getMonth() + 1)}${prefixZero(now.getDate())}${prefixZero(now.getHours())}${prefixZero(now.getMinutes())}${prefixZero(now.getSeconds())}`;
}
exports.now = now;
function timestampToDate(timestamp) {
    if (!timestamp || timestamp.length !== 14) {
        return undefined;
    }
    const year = Number(timestamp.slice(0, 4));
    const month = Number(timestamp.slice(4, 6));
    const date = Number(timestamp.slice(6, 8));
    const hours = Number(timestamp.slice(8, 10));
    const minutes = Number(timestamp.slice(10, 12));
    const seconds = Number(timestamp.slice(12, 14));
    return new Date(year, month - 1, date, hours, minutes, seconds);
}
exports.timestampToDate = timestampToDate;
function renderDate(date) {
    if (date.getDate() !== new Date().getDate()) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    return date.toLocaleTimeString();
}
exports.renderDate = renderDate;
//# sourceMappingURL=now.js.map