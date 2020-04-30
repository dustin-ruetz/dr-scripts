const path = require('path')
const spawn = require('cross-spawn')
const {hasFile, hasPkgProp, isOptedIn, resolveBin} = require('../utils.js')

const here = (p) => path.join(__dirname, p)
const hereRelative = (p) => here(p).replace(process.cwd(), '.')

const args = process.argv.slice(2)

const useBuiltInConfig =
  !hasFile('.commitlintrc.js') &&
  !hasFile('.commitlintrc.json') &&
  !hasFile('.commitlintrc.yml') &&
  !hasFile('commitlint.config.js') &&
  !hasPkgProp('commitlint')

const config = useBuiltInConfig
  ? ['--config', hereRelative('../config/.commitlintrc.js')]
  : []

const useBuiltInEnv = !args.includes('--env') && !args.includes('-E')

const env = useBuiltInEnv ? ['--env', 'HUSKY_GIT_PARAMS'] : []

const commitlintResult = spawn.sync(
  resolveBin('commitlint'),
  [...config, ...env, ...args],
  {stdio: 'inherit'},
)

if (commitlintResult.status !== 0 || !isOptedIn('commit-msg')) {
  process.exit(commitlintResult.status)
} else {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status)
}
