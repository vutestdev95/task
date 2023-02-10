module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: ["css"],
  },

  plugins: ["@typescript-eslint", "etc"],
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    quotes: "off",
    semi: ["error", "always"],
    "react/jsx-no-constructed-context-values": ["error"],
    "testing-library/no-unnecessary-act": "off",
    "testing-library/no-node-access": ["off"],
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-no-bind": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "etc/no-commented-out-code":
      process.env.STRICT_MODE === "TRUE" ? "error" : "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/require-await": "off",
  },
};
