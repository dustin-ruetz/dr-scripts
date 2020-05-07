/**
 * require the recommended rules from both ESLint React plugins
 *
 * https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js
 * https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/index.js
 */
const reactRules = require('eslint-plugin-react').configs.recommended.rules
const reactHooksRules = require('eslint-plugin-react-hooks').configs.recommended
  .rules

// make modifications to eslint-plugin-react's recommended rules
reactRules['react/no-unsafe'] = 'warn' // all unsafe methods should be accompanied by an explainer comment

module.exports = {
  env: {
    browser: true,
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // spread both sets of recommended rules (includes above modifications)
    ...reactRules,
    ...reactHooksRules,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
