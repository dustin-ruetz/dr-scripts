const path = require('path')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const {hasFile, hasLocalConfig, resolveBin} = require('../utils.js')

const args = process.argv.slice(2)
const parsedArgs = yargsParser(args)

const here = (p) => path.join(__dirname, p)
const hereRelative = (p) => here(p).replace(process.cwd(), '.')

const useBuiltinConfig =
  !args.includes('--config') && !hasLocalConfig('prettier')
const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/.prettierrc.js')]
  : []

const useBuiltinIgnore =
  !args.includes('--ignore-path') && !hasFile('.prettierignore')
const ignore = useBuiltinIgnore
  ? ['--ignore-path', hereRelative('../config/.prettierignore')]
  : []

const write = args.includes('--no-write') ? [] : ['--write']

// this ensures that when running the format script as a pre-commit hook,
// we make the full file path relative so that it's treated as a glob,
// and this way the .prettierignore file will be applied
const relativeArgs = args.map((a) => a.replace(`${process.cwd()}/`, ''))

// prettier-ignore
const filesToApply = parsedArgs._.length
  ? []
  : ['**/*.+(css|graphql|html|js|json|jsx|less|md|mdx|scss|ts|tsx|vue|yaml|yml)']

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...ignore, ...write, ...filesToApply].concat(relativeArgs),
  {stdio: 'inherit'},
)

process.exit(result.status)
