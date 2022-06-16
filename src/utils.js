const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const {cosmiconfigSync} = require('cosmiconfig')
const has = require('lodash.has')
const readPkgUp = require('read-pkg-up')
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

const hasPkgProp = (props) => arrify(props).some((prop) => has(pkg, prop))

const hasPkgSubProp = (pkgProp) => (props) =>
  hasPkgProp(arrify(props).map((p) => `${pkgProp}.${p}`))

const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasAnyDep = (args) =>
  [hasDep, hasDevDep, hasPeerDep].some((fn) => fn(args))

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

function isOptedIn(key, t = true, f = false) {
  if (!fs.existsSync(fromRoot('.opt-in'))) {
    return f
  }

  const contents = fs.readFileSync(fromRoot('.opt-in'), 'utf-8')
  return contents.includes(key) ? t : f
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
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  ifAnyDep,
  isOptedIn,
  parseEnv,
  pkg,
  resolveBin,
  resolveDrScripts,
}
