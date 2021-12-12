"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maskSchema_1 = require("../maskSchema");
test('maskSchema', () => {
    const schema = `datasource db {
    url = "mysql:secret-db"
  }`;
    expect(maskSchema_1.maskSchema(schema)).toMatchInlineSnapshot(`
        "datasource db {
            url = \\"***\\"
          }"
    `);
    const schema2 = `datasource db {
    provider = "mysql"
    url = env("SOME_ENV")
  }`;
    expect(maskSchema_1.maskSchema(schema2)).toMatchInlineSnapshot(`
    "datasource db {
        provider = \\"mysql\\"
        url = \\"***\\"
      }"
  `);
});
//# sourceMappingURL=maskSchema.test.js.map