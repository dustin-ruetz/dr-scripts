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
    camelcase: 'error',
    eqeqeq: ['error', 'smart'],
    'no-array-constructor': 'error',
    'no-console': 'warn',
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-path-concat': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'sort-imports': 'error',
    yoda: 'error',
    // plugin rules
    'import/no-unresolved': ['error', {amd: true, commonjs: true}],
    'import/order': 'error',
  },
}