"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCLIPathHash = exports.getProjectHash = void 0;
const getSchema_1 = require("./getSchema");
const utils_1 = require("./utils");
const crypto_1 = __importDefault(require("crypto"));
/**
 * Get a unique identifier for the project by hashing
 * the directory with `schema.prisma`
 */
async function getProjectHash() {
    const args = utils_1.arg(process.argv.slice(3), { '--schema': String });
    let projectPath = await getSchema_1.getSchemaPath(args['--schema']);
    projectPath = projectPath || process.cwd(); // Default to cwd if the schema couldn't be found
    return crypto_1.default
        .createHash('sha256')
        .update(projectPath)
        .digest('hex')
        .substring(0, 8);
}
exports.getProjectHash = getProjectHash;
/**
 * Get a unique identifier for the CLI installation path
 * which can be either global or local (in project's node_modules)
 */
function getCLIPathHash() {
    const cliPath = process.argv[1];
    return crypto_1.default
        .createHash('sha256')
        .update(cliPath)
        .digest('hex')
        .substring(0, 8);
}
exports.getCLIPathHash = getCLIPathHash;
//# sourceMappingURL=hashes.js.map