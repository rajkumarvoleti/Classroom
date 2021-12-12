"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapScalarValues = exports.maskSchema = void 0;
function maskSchema(schema) {
    const regex = /url\s*=\s*.+/;
    return schema
        .split('\n')
        .map((line) => {
        const match = regex.exec(line);
        if (match) {
            return `${line.slice(0, match.index)}url = "***"`;
        }
        return line;
    })
        .join('\n');
}
exports.maskSchema = maskSchema;
function mapScalarValues(obj, mapper) {
    const result = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            result[key] = mapScalarValues(obj[key], mapper);
        }
        else {
            result[key] = mapper(obj[key]);
        }
    }
    return result;
}
exports.mapScalarValues = mapScalarValues;
//# sourceMappingURL=maskSchema.js.map