"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getGenerators_1 = require("../../getGenerators");
const omit_1 = require("../../omit");
const pick_1 = require("../../pick");
const resolveBinary_1 = require("../../resolveBinary");
const get_platform_1 = require("@prisma/get-platform");
const strip_ansi_1 = __importDefault(require("strip-ansi"));
jest.setTimeout(20000);
describe('getGenerators', () => {
    test('basic', async () => {
        const aliases = {
            'predefined-generator': {
                generatorPath: path_1.default.join(__dirname, 'generator'),
                outputPath: __dirname,
            },
        };
        const generators = await getGenerators_1.getGenerators({
            schemaPath: path_1.default.join(__dirname, 'valid-minimal-schema.prisma'),
            providerAliases: aliases,
        });
        expect(generators.map((g) => g.manifest)).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultOutput": "default-output",
          "denylist": Array [
            "SomeForbiddenType",
          ],
          "prettyName": "This is a pretty pretty name",
          "requiresEngines": Array [
            "queryEngine",
            "migrationEngine",
          ],
        },
      ]
    `);
        expect(pick_1.pick(generators[0].options, [
            'datamodel',
            'datasources',
            'otherGenerators',
        ])).toMatchInlineSnapshot(`
      Object {
        "datamodel": "datasource db {
        provider = \\"sqlite\\"
        url      = \\"file:./dev.db\\"
      }

      generator gen {
        provider      = \\"predefined-generator\\"
        binaryTargets = [\\"darwin\\"]
      }

      model User {
        id   Int    @id
        name String
      }",
        "datasources": Array [
          Object {
            "activeProvider": "sqlite",
            "name": "db",
            "provider": Array [
              "sqlite",
            ],
            "url": Object {
              "fromEnvVar": null,
              "value": "sqlite://",
            },
          },
        ],
        "otherGenerators": Array [],
      }
    `);
        expect(omit_1.omit(generators[0].options.generator, ['output']))
            .toMatchInlineSnapshot(`
      Object {
        "binaryTargets": Array [
          "darwin",
        ],
        "config": Object {},
        "name": "gen",
        "previewFeatures": Array [],
        "provider": "predefined-generator",
      }
    `);
        generators.forEach((g) => g.stop());
    });
    test('inject engines', async () => {
        var _a, _b, _c, _d;
        const aliases = {
            'predefined-generator': {
                generatorPath: path_1.default.join(__dirname, 'generator'),
                outputPath: __dirname,
            },
        };
        const migrationEngine = await resolveBinary_1.resolveBinary('migration-engine');
        const queryEngine = await resolveBinary_1.resolveBinary('query-engine');
        const generators = await getGenerators_1.getGenerators({
            schemaPath: path_1.default.join(__dirname, 'valid-minimal-schema.prisma'),
            providerAliases: aliases,
            binaryPathsOverride: {
                queryEngine,
            },
        });
        const options = generators.map((g) => { var _a; return (_a = g.options) === null || _a === void 0 ? void 0 : _a.binaryPaths; });
        const platform = await get_platform_1.getPlatform();
        // we override queryEngine, so its paths should be equal to the one of the generator
        expect((_b = (_a = options[0]) === null || _a === void 0 ? void 0 : _a.queryEngine) === null || _b === void 0 ? void 0 : _b[platform]).toBe(queryEngine);
        // we did not override the migrationEngine, so their paths should not be equal
        expect((_d = (_c = options[0]) === null || _c === void 0 ? void 0 : _c.migrationEngine) === null || _d === void 0 ? void 0 : _d[platform]).not.toBe(migrationEngine);
        generators.forEach((g) => g.stop());
    });
    test('fail on platforms', async () => {
        const aliases = {
            'predefined-generator': {
                generatorPath: path_1.default.join(__dirname, 'generator'),
                outputPath: __dirname,
            },
        };
        await expect(getGenerators_1.getGenerators({
            schemaPath: path_1.default.join(__dirname, 'invalid-platforms-schema.prisma'),
            providerAliases: aliases,
        })).rejects.toThrow('deprecated');
    });
    test('fail on invalid binaryTarget', async () => {
        const aliases = {
            'predefined-generator': {
                generatorPath: path_1.default.join(__dirname, 'generator'),
                outputPath: __dirname,
            },
        };
        await expect(getGenerators_1.getGenerators({
            schemaPath: path_1.default.join(__dirname, 'invalid-binary-target-schema.prisma'),
            providerAliases: aliases,
        })).rejects.toThrow('Unknown');
    });
    test('fail if datasource is missing', async () => {
        expect.assertions(1);
        const aliases = {
            'predefined-generator': {
                generatorPath: path_1.default.join(__dirname, 'generator'),
                outputPath: __dirname,
            },
        };
        try {
            await getGenerators_1.getGenerators({
                schemaPath: path_1.default.join(__dirname, 'missing-datasource-schema.prisma'),
                providerAliases: aliases,
            });
        }
        catch (e) {
            expect(strip_ansi_1.default(e.message)).toMatchInlineSnapshot(`
        "
        You don't have any datasource defined in your schema.prisma.
        You can define a datasource like this:

        datasource db {
          provider = \\"postgresql\\"
          url      = env(\\"DB_URL\\")
        }

        More information in our documentation:
        https://pris.ly/d/prisma-schema
        "
      `);
        }
    });
});
//# sourceMappingURL=getGenerators.test.js.map