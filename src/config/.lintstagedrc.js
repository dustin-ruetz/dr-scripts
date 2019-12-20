const {isOptedOut, resolveBin, resolveDrScripts} = require('../utils.js')

const doctoc = resolveBin('doctoc')
const drScripts = resolveDrScripts()

module.exports = {
  // `doctoc` package automatically maintains readme.md table of contents
  'readme.md': [`${doctoc} --notitle`, 'git add'],
  '*.+(css|graphql|html|js|json|jsx|less|md|mdx|scss|ts|tsx|vue|yaml|yml)': [
    isOptedOut('autoformat', null, `${drScripts} format`),
    `${drScripts} lint`,
    `${drScripts} test --findRelatedTests`,
    isOptedOut('autoformat', null, 'git add'),
  ].filter(Boolean),
}
