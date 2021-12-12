"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandWithExecutor = void 0;
const isCurrentBinInstalledGlobally_1 = require("./isCurrentBinInstalledGlobally");
function getCommandWithExecutor(command) {
    var _a;
    // if current prisma bin is from a global dir
    if (isCurrentBinInstalledGlobally_1.isCurrentBinInstalledGlobally()) {
        // do nothing!
        return command;
    }
    else {
        // Example yarn 'yarn/1.22.4 npm/? node/v12.14.1 darwin x64'
        const yarnUsed = (_a = process.env.npm_config_user_agent) === null || _a === void 0 ? void 0 : _a.includes('yarn');
        // When running in npx, npm puts this package into a /_npx/ folder. Tested on Win, Mac, Linux
        const npxUsed = __dirname.includes('_npx');
        if (npxUsed) {
            return `npx ${command}`;
        }
        else if (yarnUsed) {
            return `yarn ${command}`;
        }
        else {
            return command;
        }
    }
}
exports.getCommandWithExecutor = getCommandWithExecutor;
//# sourceMappingURL=getCommandWithExecutor.js.map