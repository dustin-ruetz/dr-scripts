// require the recommended rules from eslint-plugin-react/index.js
// https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js
const {rules} = require('eslint-plugin-react').configs.recommended

// react/no-unsafe: all unsafe methods should be accompanied by an explainer comment
rules['react/no-unsafe'] = 'warn'

module.exports = {
  env: {
    browser: true,
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // spread the plugin's recommended rules
    ...rules,
    // recommended rules from eslint-plugin-react-hooks
    // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks/
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
