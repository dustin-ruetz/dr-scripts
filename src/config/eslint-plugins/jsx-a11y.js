// require the recommended rules from eslint-plugin-jsx-a11y/lib/index.js
// https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/index.js
const {rules} = require('eslint-plugin-jsx-a11y/lib/').configs.recommended

module.exports = {
  plugins: ['jsx-a11y'],
  rules: {
    // spread the recommended rules
    ...rules,
  },
}
