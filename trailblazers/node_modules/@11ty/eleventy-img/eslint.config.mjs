import { defineConfig } from "eslint/config";
import pluginJs from "@eslint/js";
import pluginStylistic from "@stylistic/eslint-plugin-js";
import globals from "globals";

const GLOB_JS = '**/*.?([cm])js';

export default defineConfig([
  {
    files: [GLOB_JS],
    plugins: {
      js: pluginJs,
      "@stylistic/js": pluginStylistic
    },
    extends: [
      "js/recommended",
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/semi": ["error", "always"],
    },
  },
]);
