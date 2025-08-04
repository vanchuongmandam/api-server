// eslint.config.js
const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node, 
      },
    },

    rules: {
      "indent": ["error", 2], 
      "semi": ["error", "always"], 
      "quotes": ["error", "double"],

      "no-console": "off",
      "no-unused-vars": ["warn", { "args": "none" }],

      "require-jsdoc": "off",
    },
  },
];