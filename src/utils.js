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

const fromRoot = (...p) => path.join(appDirectory, ...p)
const hasFile = (...p) => fs.existsSync(fromRoot(...p))

const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop))

function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions)
  const result = explorerSync.search(pkgPath)

  return result !== null
}

module.exports = {
  appDirectory,
  fromRoot,
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  pkg,
  resolveBin,
}
