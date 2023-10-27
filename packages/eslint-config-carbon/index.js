// Splitting rules into separate modules allow for a lower-level API if our
// default rules become difficult to extend without lots of duplication.
const coreRules = require("./rules/core");
const importRules = require("./rules/import");
const reactRules = require("./rules/react");
const jsxA11yRules = require("./rules/jsx-a11y");
const typescriptRules = require("./rules/typescript");
const importSettings = require("./settings/import");
const reactSettings = require("./settings/react");

const OFF = 0;
// const WARN = 1;
// const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
const config = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
    ecmaVersion: "latest",
    babelOptions: {
      presets: [require.resolve("@babel/preset-react")],
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  plugins: ["import", "react", "react-hooks", "jsx-a11y"],
  settings: {
    ...reactSettings,
    ...importSettings,
  },
  rules: {
    ...coreRules,
    ...importRules,
    ...reactRules,
    ...jsxA11yRules,
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: ["plugin:import/typescript"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2019,
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: ["@typescript-eslint"],
      rules: {
        ...typescriptRules,
      },
    },
    {
      files: ["**/routes/**/*.js?(x)", "**/routes/**/*.tsx"],
      rules: {
        "react/display-name": OFF,
      },
    },
  ],
};

module.exports = config;
