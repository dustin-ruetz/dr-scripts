// require the recommended rules from eslint-plugin-import/lib/index.js
// https://github.com/benmosher/eslint-plugin-import/blob/master/config/recommended.js
const {rules} = require('eslint-plugin-import/lib/').configs.recommended
const {ifAnyDep} = require('../../utils.js')

// make modifications to plugin's recommended rules
rules['import/no-unresolved'] = ['error', {commonjs: true}]

module.exports = {
  plugins: ['import'],
  rules: {
    // spread the recommended rules (includes above modifications)
    ...rules,
    // add custom rules
    'import/extensions': ['error', 'ignorePackages'],
    'import/no-absolute-path': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-self-import': 'error',
    'import/prefer-default-export': 'error',
  },
  // https://github.com/benmosher/eslint-plugin-import/blob/master/config/react.js
  settings: {
    'import/extensions': ['js', ifAnyDep('react', 'jsx')],
  },
}
