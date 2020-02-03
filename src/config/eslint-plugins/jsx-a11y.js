// require the recommended rules from eslint-plugin-jsx-a11y/lib/index.js
// https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/index.js
const {rules} = require('eslint-plugin-jsx-a11y/lib/').configs.recommended

/**
 * jsx-a11y/autocomplete-valid: getting 'definition for rule was not found' error
 * remove this code when the package issues a release that includes the below PR
 * https://github.com/evcohen/eslint-plugin-jsx-a11y/pull/661
 */
delete rules['jsx-a11y/autocomplete-valid']

module.exports = {
  plugins: ['jsx-a11y'],
  rules: {
    // spread the plugin's recommended rules
    ...rules,
  },
}
