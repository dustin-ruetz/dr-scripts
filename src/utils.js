const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const {cosmiconfigSync} = require('cosmiconfig')
const has = require('lodash.has')
const mkdirp = require('mkdirp')
const readPkgUp = require('read-pkg-up')
const rimraf = require('rimraf')
const which = require('which')

const {packageJson: pkg, path: pkgPath} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
const appDirectory = path.dirname(pkgPath)

function resolveBin(modName, {executable = modName, cwd = process.cwd()} = {}) {
  let pathFromWhich

  try {
    pathFromWhich = fs.realpathSync(which.sync(executable))
    if (pathFromWhich && pathFromWhich.includes('.CMD')) {
      return pathFromWhich
    }
  } catch (error) {
    // ignore error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`)
    const modPkgDir = path.dirname(modPkgPath)
    const {bin} = require(modPkgPath)
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)

    if (fullPathToBin === pathFromWhich) {
      return executable
    } else {
      return fullPathToBin.replace(cwd, '.')
    }
  } catch (error) {
    if (pathFromWhich) {
      return executable
    } else {
      throw error
    }
  }
}

function resolveDrScripts() {
  if (pkg.name === 'dr-scripts') {
    return require.resolve('./').replace(process.cwd(), '.')
  } else {
    return resolveBin('dr-scripts')
  }
}

const fromRoot = (...p) => path.join(appDirectory, ...p)
const hasFile = (...p) => fs.existsSync(fromRoot(...p))

const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop))

const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))

const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasAnyDep = args => [hasDep, hasDevDep, hasPeerDep].some(fn => fn(args))

const ifAnyDep = (deps, t, f) => (hasAnyDep(arrify(deps)) ? t : f)

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name])
    } catch (error) {
      return process.env[name]
    }
  } else {
    return def
  }
}

function envIsSet(name) {
  return (
    Object.prototype.hasOwnProperty.call(process.env, name) &&
    process.env[name] &&
    process.env[name] !== 'undefined'
  )
}

function getConcurrentlyArgs(scripts, {killOthers = true} = {}) {
  const colors = [
    'bgBlack',
    'bgBlue',
    'bgCyan',
    'bgGreen',
    'bgMagenta',
    'bgRed',
    'bgYellow',
    'bgWhite',
  ]

  scripts = Object.entries(scripts).reduce((all, [name, script]) => {
    if (script) {
      all[name] = script
    }

    return all
  }, {})

  const prefixColors = Object.keys(scripts)
    .reduce(
      (pColors, _s, i) =>
        pColors.concat([`${colors[i % colors.length]}.bold.reset`]),
      [],
    )
    .join(',')

  // prettier-ignore
  return [
    killOthers ? '--kill-others-on-fail' : null,
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    '--prefix-colors', prefixColors,
    // use JSON.stringify to escape quotes
    ...Object.values(scripts).map(s => JSON.stringify(s)),
  ].filter(Boolean)
}

function isOptedIn(key, t = true, f = false) {
  if (!fs.existsSync(fromRoot('.opt-in'))) {
    return f
  }

  const contents = fs.readFileSync(fromRoot('.opt-in'), 'utf-8')
  return contents.includes(key) ? t : f
}

function isOptedOut(key, t = true, f = false) {
  if (!fs.existsSync(fromRoot('.opt-out'))) {
    return f
  }

  const contents = fs.readFileSync(fromRoot('.opt-out'), 'utf-8')
  return contents.includes(key) ? t : f
}

function writeExtraEntry(name, {cjs, esm}, clean = true) {
  if (clean) {
    rimraf.sync(fromRoot(name))
  }

  mkdirp.sync(fromRoot(name))

  const pkgJson = fromRoot(`${name}/package.json`)
  const entryDir = fromRoot(name)

  fs.writeFileSync(
    pkgJson,
    JSON.stringify(
      {
        main: path.relative(entryDir, cjs),
        'jsnext:main': path.relative(entryDir, esm),
        module: path.relative(entryDir, esm),
      },
      null,
      2,
    ),
  )
}

function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions)
  const result = explorerSync.search(pkgPath)

  return result !== null
}

module.exports = {
  appDirectory,
  envIsSet,
  fromRoot,
  getConcurrentlyArgs,
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  ifAnyDep,
  isOptedIn,
  isOptedOut,
  parseEnv,
  pkg,
  resolveBin,
  resolveDrScripts,
  writeExtraEntry,
}
