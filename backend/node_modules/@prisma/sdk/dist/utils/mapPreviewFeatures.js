"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPreviewFeatures = void 0;
const featureFlagMap = {
    transactionApi: 'transaction',
    aggregateApi: 'aggregations',
};
function mapPreviewFeatures(features) {
    if (Array.isArray(features) && features.length > 0) {
        return features.map((f) => { var _a; return (_a = featureFlagMap[f]) !== null && _a !== void 0 ? _a : f; });
    }
    return [];
}
exports.mapPreviewFeatures = mapPreviewFeatures;
//# sourceMappingURL=mapPreviewFeatures.js.map