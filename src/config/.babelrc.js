const browserslist = require('browserslist')
const semver = require('semver')
const {appDirectory, ifAnyDep, parseEnv, pkg} = require('../utils.js')

const {BABEL_ENV, NODE_ENV, BUILD_FORMAT} = process.env

const isTest = (BABEL_ENV || NODE_ENV) === 'test'
const isPreact = parseEnv('BUILD_PREACT', false)
const isRollup = parseEnv('BUILD_ROLLUP', false)
const isUMD = BUILD_FORMAT === 'umd'
const isCJS = BUILD_FORMAT === 'cjs'
const isWebpack = parseEnv('BUILD_WEBPACK', false)
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack)
const alias = parseEnv('BUILD_ALIAS', isPreact ? {react: 'preact'} : null)

const hasBabelRuntimeDep = Boolean(
  pkg.dependencies && pkg.dependencies['@babel/runtime'],
)
const RUNTIME_HELPERS_WARN =
  'You should add @babel/runtime as dependency to your package. It will allow reusing ' +
  '"babel helpers" from node_modules rather than bundling their copies into your files.'

if (!treeshake && !hasBabelRuntimeDep && !isTest) {
  throw new Error(RUNTIME_HELPERS_WARN)
} else if (treeshake && !isUMD && !hasBabelRuntimeDep) {
  // eslint-disable-next-line no-console
  console.warn(RUNTIME_HELPERS_WARN)
}

/**
 * use the strategy declared by browserslist to load browser's configuration
 * fallback to the default if it doesn't find custom configuration
 * @see https://github.com/browserslist/browserslist/blob/master/node.js#L139
 */
const browsersConfig = browserslist.loadConfig({path: appDirectory}) || [
  'ie 11',
]

const envTargets = isTest
  ? {node: 'current'}
  : isWebpack || isRollup
  ? {browsers: browsersConfig}
  : {node: getNodeVersion(pkg)}
const envOptions = {modules: false, loose: true, targets: envTargets}

module.exports = () => ({
  presets: [
    [require.resolve('@babel/preset-env'), envOptions],
    ifAnyDep(
      ['react', 'preact'],
      [
        require.resolve('@babel/preset-react'),
        {pragma: isPreact ? 'React.h' : undefined},
      ],
    ),
  ].filter(Boolean),
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {useESModules: treeshake && !isCJS},
    ],
    require.resolve('babel-plugin-macros'),
    alias
      ? [
          require.resolve('babel-plugin-module-resolver'),
          {root: ['./src'], alias},
        ]
      : null,
    [
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
      isPreact ? {removeImport: true} : {mode: 'unsafe-wrap'},
    ],
    isUMD
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
    require.resolve('babel-plugin-minify-dead-code-elimination'),
    treeshake
      ? null
      : require.resolve('@babel/plugin-transform-modules-commonjs'),
  ].filter(Boolean),
})

function getNodeVersion({engines: {node: nodeVersion = '8'} = {}}) {
  const oldestVersion = semver
    .validRange(nodeVersion)
    .replace(/[>=<|]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .sort(semver.compare)[0]

  if (!oldestVersion) {
    throw new Error(
      'Unable to determine the oldest version in the range in your package.json at' +
        `engines.node: "${nodeVersion}". Please try to make it less ambiguous.`,
    )
  }

  return oldestVersion
}
