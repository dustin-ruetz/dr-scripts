const {ifAnyDep} = require('../utils.js')

module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    './eslint-plugins/import.js',
    /**
     * normally this is where you extend recommended configs, for example
     * 'plugin:react/recommended', 'plugin:jsx-a11y/recommended' (etc.)
     *
     * extending a plugin's recommended config doesn't work for applications that
     * consume dr-scripts because ESLint can only do this when the plugins are
     * explicitly installed in the application's package.json
     *
     * open the ./eslint-plugin/*.js files to see how they work
     */
    ifAnyDep('pug', './eslint-extends/pug.js'),
    ifAnyDep('react', './eslint-plugins/react.js'),
    ifAnyDep('react', './eslint-plugins/jsx-a11y.js'),
  ].filter(Boolean),
  parserOptions: {
    ecmaFeatures: {
      jsx: ifAnyDep('react', true, false),
    },
    ecmaVersion: 2020,
    sourceType: 'module',
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
    'prefer-const': 'error',
    yoda: 'error',
  },
}
