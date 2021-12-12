"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPreviewFeatures = void 0;
function extractPreviewFeatures(config) {
    var _a;
    return (((_a = config.generators.find((g) => g.provider === 'prisma-client-js')) === null || _a === void 0 ? void 0 : _a.previewFeatures) || []);
}
exports.extractPreviewFeatures = extractPreviewFeatures;
//# sourceMappingURL=extractPreviewFeatures.js.map