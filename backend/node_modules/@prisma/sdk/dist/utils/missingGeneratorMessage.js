"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingModelMessage = exports.missingGeneratorMessage = void 0;
const chalk_1 = __importDefault(require("chalk"));
const highlight_1 = require("../highlight/highlight");
const link_1 = require("../link");
exports.missingGeneratorMessage = `\n${chalk_1.default.blue('info')} You don't have any generators defined in your ${chalk_1.default.bold('schema.prisma')}, so nothing will be generated.
You can define them like this:

${chalk_1.default.bold(highlight_1.highlightDatamodel(`generator client {
  provider = "prisma-client-js"
}`))}`;
exports.missingModelMessage = `\nYou don't have any ${chalk_1.default.bold('models')} defined in your ${chalk_1.default.bold('schema.prisma')}, so nothing will be generated.
You can define a model like this:

${chalk_1.default.bold(highlight_1.highlightDatamodel(`model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`))}

More information in our documentation:
${link_1.link('https://pris.ly/d/prisma-schema')}
`;
//# sourceMappingURL=missingGeneratorMessage.js.map