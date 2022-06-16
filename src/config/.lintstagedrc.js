const {resolveBin, resolveDrScripts} = require('../utils.js')

const doctoc = resolveBin('doctoc')
const drScripts = resolveDrScripts()

module.exports = {
  // `doctoc` package automatically maintains readme.md table of contents
  'readme.md': [`${doctoc} --notitle`],
  // run formatting on filetypes used for configuration
  '*.+(json|yaml|yml)': [`${drScripts} format`],
  // run formatting/linting/testing on all other filetypes
  '*.+(css|gql|graphql|html|js|jsx|less|md|mdx|scss|ts|tsx|vue)': [
    `${drScripts} format`,
    `${drScripts} lint`,
    `${drScripts} test --findRelatedTests`,
  ],
}
