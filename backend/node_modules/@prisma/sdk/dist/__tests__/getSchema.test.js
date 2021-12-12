"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getSchema_1 = require("../cli/getSchema");
process.env.npm_config_user_agent = 'yarn/1.22.4 npm/? node/v12.18.3 darwin x64';
const FIXTURE_CWD = path_1.default.resolve(__dirname, 'fixtures', 'getSchema');
async function testSchemaPath(fixtureName, schemaPathFromArgs) {
    const cwd = path_1.default.resolve(FIXTURE_CWD, fixtureName);
    let syncResult;
    let asyncResult;
    try {
        syncResult = getSchema_1.getSchemaPathSyncInternal(schemaPathFromArgs, {
            cwd,
        });
    }
    catch (e) {
        syncResult = e;
    }
    try {
        asyncResult = await getSchema_1.getSchemaPathInternal(schemaPathFromArgs, {
            cwd,
        });
    }
    catch (e) {
        asyncResult = e;
    }
    /**
     * Make paths relatives to enable snapshot testing on any machines
     */
    if (typeof syncResult === 'string') {
        syncResult = path_1.default.relative('.', syncResult);
    }
    if (typeof asyncResult === 'string') {
        asyncResult = path_1.default.relative('.', asyncResult);
    }
    if (syncResult instanceof Error) {
        syncResult.message = syncResult.message.replace(__dirname, '.');
    }
    if (asyncResult instanceof Error) {
        asyncResult.message = asyncResult.message.replace(__dirname, '.');
    }
    return {
        sync: syncResult,
        async: asyncResult,
    };
}
it('returns null if no schema is found', async () => {
    const res = await testSchemaPath('no-schema');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": null,
      "sync": null,
    }
  `);
});
it('reads from --schema args first even if package.json is provided', async () => {
    const res = await testSchemaPath('pkg-json-with-schema-args', path_1.default.resolve(FIXTURE_CWD, 'pkg-json-with-schema-args', 'schema.prisma'));
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/pkg-json-with-schema-args/schema.prisma",
      "sync": "src/__tests__/fixtures/getSchema/pkg-json-with-schema-args/schema.prisma",
    }
  `);
});
it('throws if schema args path is invalid', async () => {
    const res = await testSchemaPath('pkg-json-with-schema-args', path_1.default.resolve(FIXTURE_CWD, 'wrong_path'));
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": [Error: Provided --schema at ./fixtures/getSchema/wrong_path doesn't exist.],
      "sync": [Error: Provided --schema at ./fixtures/getSchema/wrong_path doesn't exist.],
    }
  `);
});
it('reads relative schema path from the nearest package.json', async () => {
    const res = await testSchemaPath('pkg-json-valid-relative-path');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/pkg-json-valid-relative-path/db/schema.prisma",
      "sync": "src/__tests__/fixtures/getSchema/pkg-json-valid-relative-path/db/schema.prisma",
    }
  `);
});
it('reads schema path from the nearest package.json and throws if path does not exist', async () => {
    const res = await testSchemaPath('pkg-json-invalid-path');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": [Error: Provided schema path \`wrong-path\` from \`package.json\` doesn't exist.],
      "sync": [Error: Provided schema path \`wrong-path\` from \`package.json\` doesn't exist.],
    }
  `);
});
it('reads schema path from the nearest package.json and throws if path is not of type string', async () => {
    const res = await testSchemaPath('pkg-json-invalid-path-not-string');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": [Error: Provided schema path \`123\` from \`package.json\` must be of type string],
      "sync": [Error: Provided schema path \`123\` from \`package.json\` must be of type string],
    }
  `);
});
it('reads from the nearest package.json of the cwd', async () => {
    const res = await testSchemaPath('pkg-json-nearest/packages/a');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/pkg-json-nearest/packages/a/db/schema.prisma",
      "sync": "src/__tests__/fixtures/getSchema/pkg-json-nearest/packages/a/db/schema.prisma",
    }
  `);
});
it('finds the conventional prisma/schema path without configuration', async () => {
    const res = await testSchemaPath('conventional-path');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/conventional-path/prisma/schema.prisma",
      "sync": "src/__tests__/fixtures/getSchema/conventional-path/prisma/schema.prisma",
    }
  `);
});
it('finds the schema path in the root package.json of a yarn workspace from a child package', async () => {
    const res = await testSchemaPath('pkg-json-workspace-parent/packages/a');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/pkg-json-workspace-parent/db/prisma.schema",
      "sync": "src/__tests__/fixtures/getSchema/pkg-json-workspace-parent/db/prisma.schema",
    }
  `);
});
it('finds the conventional schema path with yarn workspaces', async () => {
    const res = await testSchemaPath('conventional-path-workspaces');
    expect(res).toMatchInlineSnapshot(`
    Object {
      "async": "src/__tests__/fixtures/getSchema/conventional-path-workspaces/packages/b/schema.prisma",
      "sync": "src/__tests__/fixtures/getSchema/conventional-path-workspaces/packages/b/schema.prisma",
    }
  `);
});
//# sourceMappingURL=getSchema.test.js.map