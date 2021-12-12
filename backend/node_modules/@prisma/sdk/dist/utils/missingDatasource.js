"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingDatasource = void 0;
const chalk_1 = __importDefault(require("chalk"));
const highlight_1 = require("../highlight/highlight");
const link_1 = require("../link");
exports.missingDatasource = `\nYou don't have any ${chalk_1.default.bold('datasource')} defined in your ${chalk_1.default.bold('schema.prisma')}.
You can define a datasource like this:

${chalk_1.default.bold(highlight_1.highlightDatamodel(`datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}`))}

More information in our documentation:
${link_1.link('https://pris.ly/d/prisma-schema')}
`;
//# sourceMappingURL=missingDatasource.js.map