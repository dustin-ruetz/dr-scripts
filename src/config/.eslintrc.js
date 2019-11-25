module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    'no-console': 'warn',
    'no-var': 'error',
    'sort-imports': 'error',
    // plugin rules
    'import/no-unresolved': ['error', {amd: true, commonjs: true}],
    'import/order': ['error'],
  },
}
