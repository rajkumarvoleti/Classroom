"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropDatabase = exports.createDatabase = exports.canConnectToDatabase = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const convertCredentials_1 = require("./convertCredentials");
const resolveBinary_1 = require("./resolveBinary");
const getSchema_1 = require("./cli/getSchema");
const exists = util_1.promisify(fs_1.default.exists);
async function canConnectToDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
    const credentials = convertCredentials_1.uriToCredentials(connectionString);
    if (credentials.type === 'sqlite') {
        const sqliteExists = await doesSqliteDbExist(connectionString, cwd);
        if (sqliteExists) {
            return true;
        }
        else {
            return {
                code: 'P1003',
                message: "SQLite database file doesn't exist",
            };
        }
    }
    migrationEnginePath =
        migrationEnginePath || (await resolveBinary_1.resolveBinary('migration-engine'));
    try {
        await execa_1.default(migrationEnginePath, ['cli', '--datasource', connectionString, 'can-connect-to-database'], {
            cwd,
            env: {
                RUST_BACKTRACE: '1',
                RUST_LOG: 'info',
            },
        });
        return true;
    }
    catch (e) {
        if (e.stdout) {
            let json;
            try {
                json = JSON.parse(e.stdout);
            }
            catch (e) {
                throw new Error(`Can't parse migration engine response:\n${e.stdout}`);
            }
            return {
                code: json.error_code,
                message: json.message,
                meta: json.meta,
            };
        }
        else if (e.stderr) {
            throw new Error(`Migration engine error:\n${e.stderr}`);
        }
        else {
            throw new Error(`Migration engine exited.`);
        }
    }
}
exports.canConnectToDatabase = canConnectToDatabase;
async function createDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
    const dbExists = await canConnectToDatabase(connectionString, cwd, migrationEnginePath);
    if (dbExists === true) {
        return false;
    }
    migrationEnginePath =
        migrationEnginePath || (await resolveBinary_1.resolveBinary('migration-engine'));
    return await execa_1.default(migrationEnginePath, ['cli', '--datasource', connectionString, 'create-database'], {
        cwd,
        env: {
            RUST_BACKTRACE: '1',
            RUST_LOG: 'info',
        },
    });
}
exports.createDatabase = createDatabase;
async function dropDatabase(connectionString, cwd = process.cwd(), migrationEnginePath) {
    migrationEnginePath =
        migrationEnginePath || (await resolveBinary_1.resolveBinary('migration-engine'));
    return await execa_1.default(migrationEnginePath, ['cli', '--datasource', connectionString, 'drop-database'], {
        cwd,
        env: {
            RUST_BACKTRACE: '1',
            RUST_LOG: 'info',
        },
    });
}
exports.dropDatabase = dropDatabase;
async function doesSqliteDbExist(connectionString, schemaDir) {
    let filePath = connectionString;
    if (filePath.startsWith('file:')) {
        filePath = filePath.slice(5);
    }
    else if (filePath.startsWith('sqlite:')) {
        filePath = filePath.slice(7);
    }
    const cwd = schemaDir || (await getSchema_1.getSchemaDir());
    if (!cwd) {
        throw new Error(`Could not find schema.prisma in ${process.cwd()}`);
    }
    const absoluteTarget = path_1.default.resolve(cwd, filePath);
    return exists(absoluteTarget);
}
//# sourceMappingURL=migrateEngineCommands.js.map