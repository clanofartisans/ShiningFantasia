module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "node": true,
        "es2021": true,
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern":"^_" }]
    },
    "ignorePatterns": [".eslintrc.js", "webpack.config.js"],
};
