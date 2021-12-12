"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorArea = exports.RustPanic = void 0;
class RustPanic extends Error {
    constructor(message, rustStack, request, area, schemaPath, schema, introspectionUrl) {
        super(message);
        this.rustStack = rustStack;
        this.request = request;
        this.area = area;
        this.schemaPath = schemaPath;
        this.schema = schema;
        this.introspectionUrl = introspectionUrl;
    }
}
exports.RustPanic = RustPanic;
var ErrorArea;
(function (ErrorArea) {
    ErrorArea["LIFT_CLI"] = "LIFT_CLI";
    ErrorArea["PHOTON_STUDIO"] = "PHOTON_STUDIO";
    ErrorArea["INTROSPECTION_CLI"] = "INTROSPECTION_CLI";
})(ErrorArea = exports.ErrorArea || (exports.ErrorArea = {}));
//# sourceMappingURL=panic.js.map