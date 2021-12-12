"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrentBinInstalledGlobally = void 0;
const fs_1 = __importDefault(require("fs"));
const global_dirs_1 = __importDefault(require("global-dirs"));
// returns if current prisma bin is installed globally
function isCurrentBinInstalledGlobally() {
    try {
        const realPrismaPath = fs_1.default.realpathSync(process.argv[1]);
        const usingGlobalYarn = realPrismaPath.indexOf(global_dirs_1.default.yarn.packages) === 0;
        const usingGlobalNpm = realPrismaPath.indexOf(fs_1.default.realpathSync(global_dirs_1.default.npm.packages)) === 0;
        if (usingGlobalNpm) {
            return 'npm';
        }
        if (usingGlobalYarn) {
            return 'yarn';
        }
        else {
            false;
        }
    }
    catch (e) {
        //
    }
    return false;
}
exports.isCurrentBinInstalledGlobally = isCurrentBinInstalledGlobally;
//# sourceMappingURL=isCurrentBinInstalledGlobally.js.map