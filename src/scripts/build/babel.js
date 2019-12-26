const path = require('path')
const spawn = require('cross-spawn')
const glob = require('glob')
const rimraf = require('rimraf')
const yargsParser = require('yargs-parser')
const {fromRoot, hasFile, hasPkgProp, resolveBin} = require('../../utils.js')

let args = process.argv.slice(2)

const here = p => path.join(__dirname, p)

const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--presets') &&
  !hasFile('.babelrc') &&
  !hasFile('.babelrc.js') &&
  !hasFile('babel.config.js') &&
  !hasPkgProp('babel')
const config = useBuiltinConfig
  ? ['--presets', here('../../config/.babelrc.js')]
  : []

const builtInIgnore = '**/__mocks__/**,**/__tests__/**'

const ignore = args.includes('--ignore') ? [] : ['--ignore', builtInIgnore]

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files']

const useSpecifiedOutDir = args.includes('--out-dir')
const builtInOutDir = 'dist'
const outDir = useSpecifiedOutDir ? [] : ['--out-dir', builtInOutDir]

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot('dist'))
} else {
  args = args.filter(a => a !== '--no-clean')
}

const result = spawn.sync(
  resolveBin('@babel/cli', {executable: 'babel'}),
  [...outDir, ...copyFiles, ...ignore, ...config, 'src'].concat(args),
  {stdio: 'inherit'},
)

// we need to remove the ignored files, otherwise Babel will still copy them
const pathToOutDir = fromRoot(parsedArgs.outDir || builtInOutDir)
const ignoredPatterns = (parsedArgs.ignore || builtInIgnore)
  .split(',')
  .map(pattern => path.join(pathToOutDir, pattern))
const ignoredFiles = ignoredPatterns.reduce(
  (all, pattern) => [...all, ...glob.sync(pattern)],
  [],
)
ignoredFiles.forEach(ignoredFile => {
  rimraf.sync(ignoredFile)
})

process.exit(result.status)
