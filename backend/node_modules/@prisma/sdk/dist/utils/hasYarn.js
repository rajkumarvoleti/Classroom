"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasYarn = void 0;
const execa_1 = __importDefault(require("execa"));
/**
 * Checks if yarn is available
 * we can't check with `npm ls -g yarn --depth=0` as yarn can be installed locally
 *
 * @param {string} packageDir
 * @return {boolean}
 */
async function hasYarn(packageDir) {
    try {
        await execa_1.default.command('yarn --version', {
            shell: true,
            cwd: packageDir,
        });
        return true;
    }
    catch (e) {
        // if we are here - yarn is not installed
        return false;
    }
}
exports.hasYarn = hasYarn;
//# sourceMappingURL=hasYarn.js.map