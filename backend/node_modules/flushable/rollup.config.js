import pkg from "./package.json";
import babel from "rollup-plugin-babel";
import execute from "rollup-plugin-execute";

// rollup.config.js
export default {
  input: "src/index.js",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
    {
      name: "map",
      file: pkg.browser,
      format: "umd"
    }
  ],
  plugins: [
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }], "@babel/preset-flow"],
      exclude: "node_modules/**"
    }),
    execute(`echo "// @flow\n\nexport * from '../src';" > ${pkg.main}.flow`)
  ]
};
