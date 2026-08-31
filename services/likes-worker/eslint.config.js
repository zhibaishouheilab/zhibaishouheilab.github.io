import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/**", ".wrangler/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
];
