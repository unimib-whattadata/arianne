import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import noRelativeImport from "eslint-plugin-no-relative-import-paths";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "no-relative-import-paths": noRelativeImport,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: true, rootDir: "src", prefix: "@" },
      ],
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
];