export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "single"], // Enforce single quotes
    "max-len": ["error", { code: 80 }], // Set max line width to 80 characters
  },
};
