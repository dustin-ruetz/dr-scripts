const path = require('path')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const {
  fromRoot,
  hasFile,
  hasPkgProp,
  ifAnyDep,
  resolveBin,
} = require('../utils.js')

let args = process.argv.slice(2)
const here = (p) => path.join(__dirname, p)
const hereRelative = (p) => here(p).replace(process.cwd(), '.')
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('.eslintrc') &&
  !hasFile('.eslintrc.js') &&
  !hasPkgProp('eslintConfig')

const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/.eslintrc.js')]
  : []

const useBuiltinIgnore =
  !args.includes('--ignore-path') &&
  !hasFile('.eslintignore') &&
  !hasPkgProp('eslintIgnore')

const ignore = useBuiltinIgnore
  ? ['--ignore-path', hereRelative('../config/.eslintignore')]
  : []

const cache = args.includes('--no-cache')
  ? []
  : [
      '--cache',
      '--cache-location',
      fromRoot('node_modules/.cache/.eslintcache'),
    ]

const filesGiven = parsedArgs._.length > 0

const filesToApply = filesGiven ? [] : ['.']

if (filesGiven) {
  // take all the flag-less arguments (the files that should be linted) and
  // and filter out the ones that aren't JavaScript, otherwise
  // non-JS files may be passed through
  args = args.filter((a) => !parsedArgs._.includes(a) || /\.jsx?$/.test(a))
}

const extensions = ['--ext', '.js']
ifAnyDep('react', (extensions[1] = extensions[1].concat(',.jsx')))

const result = spawn.sync(
  resolveBin('eslint'),
  [...config, ...ignore, ...cache, ...args, ...filesToApply, ...extensions],
  {stdio: 'inherit'},
)

process.exit(result.status)
