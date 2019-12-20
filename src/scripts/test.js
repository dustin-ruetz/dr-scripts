process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const isCI = require('is-ci')
const {hasFile, hasPkgProp, parseEnv} = require('../utils.js')

const args = process.argv.slice(2)

const watch =
  !isCI &&
  !parseEnv('SCRIPTS_PRE-COMMIT', false) &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const config =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')
    ? ['--config', JSON.stringify(require('../config/.jestrc.js'))]
    : []

require('jest').run([...config, ...watch, ...args])
