"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeCopyToTmp = exports.resolveBinary = exports.engineEnvVarMap = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const temp_dir_1 = __importDefault(require("temp-dir"));
const make_dir_1 = __importDefault(require("make-dir"));
const util_1 = require("util");
const get_platform_1 = require("@prisma/get-platform");
const util_2 = require("@prisma/engine-core/dist/util");
const engines_1 = require("@prisma/engines");
const readFile = util_1.promisify(fs_1.default.readFile);
const writeFile = util_1.promisify(fs_1.default.writeFile);
exports.engineEnvVarMap = {
    'query-engine': 'PRISMA_QUERY_ENGINE_BINARY',
    'migration-engine': 'PRISMA_MIGRATION_ENGINE_BINARY',
    'introspection-engine': 'PRISMA_INTROSPECTION_ENGINE_BINARY',
    'prisma-fmt': 'PRISMA_FMT_BINARY',
};
async function resolveBinary(name, proposedPath) {
    if (proposedPath &&
        !proposedPath.startsWith('/snapshot/') &&
        fs_1.default.existsSync(proposedPath)) {
        return proposedPath;
    }
    // tslint:disable-next-line
    const envVar = exports.engineEnvVarMap[name];
    if (process.env[envVar]) {
        if (!fs_1.default.existsSync(process.env[envVar])) {
            throw new Error(`Env var ${envVar} is provided, but provided path ${process.env[envVar]} can't be resolved.`);
        }
        return process.env[envVar];
    }
    const dir = eval('__dirname');
    const platform = await get_platform_1.getPlatform();
    const extension = platform === 'windows' ? '.exe' : '';
    const binaryName = `${name}-${platform}${extension}`;
    let prismaPath = path_1.default.join(engines_1.getEnginesPath(), binaryName);
    if (fs_1.default.existsSync(prismaPath)) {
        return maybeCopyToTmp(prismaPath);
    }
    // for pkg
    prismaPath = path_1.default.join(__dirname, '..', binaryName);
    if (fs_1.default.existsSync(prismaPath)) {
        return maybeCopyToTmp(prismaPath);
    }
    prismaPath = path_1.default.join(__dirname, '../..', binaryName);
    if (fs_1.default.existsSync(prismaPath)) {
        return maybeCopyToTmp(prismaPath);
    }
    // needed to come from @prisma/client/generator-build to @prisma/client/runtime
    prismaPath = path_1.default.join(__dirname, '../runtime', binaryName);
    if (fs_1.default.existsSync(prismaPath)) {
        return maybeCopyToTmp(prismaPath);
    }
    throw new Error(`Could not find ${name} binary. Searched in ${path_1.default.join(dir, '..', binaryName)} and ${path_1.default.join(dir, '../..', binaryName)}`);
}
exports.resolveBinary = resolveBinary;
async function maybeCopyToTmp(file) {
    // in this case, we are in a "pkg" context with a virtual fs
    // to make this work, we need to copy the binary to /tmp and execute it from there
    const dir = eval('__dirname');
    if (dir.startsWith('/snapshot/')) {
        const targetDir = path_1.default.join(temp_dir_1.default, 'prisma-binaries');
        await make_dir_1.default(targetDir);
        const target = path_1.default.join(targetDir, path_1.default.basename(file));
        const data = await readFile(file);
        await writeFile(target, data);
        // We have to read and write until https://github.com/zeit/pkg/issues/639
        // is resolved
        // await copyFile(file, target)
        util_2.plusX(target);
        return target;
    }
    return file;
}
exports.maybeCopyToTmp = maybeCopyToTmp;
//# sourceMappingURL=resolveBinary.js.map