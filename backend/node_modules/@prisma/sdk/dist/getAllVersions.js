"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engineVersions = void 0;
// import fetch from 'node-fetch'
// import fs from 'fs'
// import path from 'path'
var versions_1 = require("./versions");
Object.defineProperty(exports, "engineVersions", { enumerable: true, get: function () { return versions_1.engineVersions; } });
// async function getAllVersions() {
//   const url = `https://registry.npmjs.org/@prisma/cli`
//   const pkg = await fetch(url).then((r) => r.json())
//   if (pkg.versions) {
//     const obj = Object.create(null)
//     for (const version in pkg.versions) {
//       if (!version.startsWith('2.0.0-alpha') && version.startsWith('2.')) {
//         const prismaVersion = pkg.versions[version]?.prisma?.version
//         if (prismaVersion) {
//           obj[version] = prismaVersion
//         }
//       }
//     }
//     return obj
//   }
//   return null
// }
// async function saveVersions() {
//   const versions = await getAllVersions()
//   const str = JSON.stringify(versions)
//   fs.writeFileSync(path.join(__dirname, 'versions.json'), str, 'utf-8')
// }
// saveVersions()
//# sourceMappingURL=getAllVersions.js.map