const babelJest = require('babel-jest')
const {ifAnyDep} = require('../utils.js')

/**
 * this small babel-jest transformer + Babel preset configuration is only intended
 * for use by Jest; it's not being used for building/transpiling application code
 *
 * rationale: leave the complexity and responsibility of Babel config
 * to the frameworks (create-react-app, Next.js, etc.)
 */
module.exports = babelJest.createTransformer({
  // below presets enable certain JS features to work with Jest
  presets: [
    // preset-env enables ESM imports
    [require.resolve('@babel/preset-env')],
    // preset-react enables JSX features (ex: <>React Fragments</>)
    ifAnyDep('react', [require.resolve('@babel/preset-react')]),
  ].filter(Boolean),
})
