"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOutput = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const exists = util_1.promisify(fs_1.default.exists);
async function resolveNodeModulesBase(cwd) {
    if (await exists(path_1.default.resolve(process.cwd(), 'prisma/schema.prisma'))) {
        return process.cwd();
    }
    if (path_1.default.relative(process.cwd(), cwd) === 'prisma' &&
        (await exists(path_1.default.resolve(process.cwd(), 'package.json')))) {
        return process.cwd();
    }
    if (await exists(path_1.default.resolve(cwd, 'node_modules'))) {
        return cwd;
    }
    if (await exists(path_1.default.resolve(cwd, '../node_modules'))) {
        return path_1.default.join(cwd, '../');
    }
    if (await exists(path_1.default.resolve(cwd, 'package.json'))) {
        return cwd;
    }
    if (await exists(path_1.default.resolve(cwd, '../package.json'))) {
        return path_1.default.join(cwd, '../');
    }
    return cwd;
}
async function resolveOutput(options) {
    const defaultOutput = stripRelativePath(options.defaultOutput);
    if (defaultOutput.startsWith('node_modules')) {
        const nodeModulesBase = await resolveNodeModulesBase(options.baseDir);
        return path_1.default.resolve(nodeModulesBase, defaultOutput);
    }
    return path_1.default.resolve(options.baseDir, defaultOutput);
}
exports.resolveOutput = resolveOutput;
function stripRelativePath(pathString) {
    if (pathString.startsWith('./')) {
        return pathString.slice(2);
    }
    return pathString;
}
//# sourceMappingURL=resolveOutput.js.map