jest.mock('cosmiconfig', () => {
  const cosmiconfigExports = jest.requireActual('cosmiconfig')

  return {
    ...cosmiconfigExports,
    cosmiconfigSync: jest.fn(),
  }
})

jest.mock('read-pkg-up', () => ({
  sync: jest.fn(() => ({
    packageJson: {},
    path: '/mock/package.json',
  })),
}))

jest.mock('which', () => ({
  sync: jest.fn(() => {}),
}))

let readPkgUpSyncMock
let whichSyncMock

beforeEach(() => {
  jest.resetModules()
  readPkgUpSyncMock = require('read-pkg-up').sync
  whichSyncMock = require('which').sync
})

function mockCosmiconfig(result = null) {
  const {cosmiconfigSync} = require('cosmiconfig')

  cosmiconfigSync.mockImplementationOnce(() => ({
    search: () => result,
  }))
}

function mockPkg({package: pkg = {}, path = '/mock/package.json'}) {
  readPkgUpSyncMock.mockImplementationOnce(() => ({packageJson: pkg, path}))
}

test('package is the package.json', () => {
  const mockPackage = {name: 'mockPackage'}
  mockPkg({package: mockPackage})

  expect(require('../utils.js').pkg).toBe(mockPackage)
})

test('appDirectory is the dirname to the package.json', () => {
  const mockPackagePath = '/path/to/mockPackage'
  mockPkg({path: `${mockPackagePath}/package.json`})

  expect(require('../utils.js').appDirectory).toBe(mockPackagePath)
})

test('resolveDrScripts resolves to src/index.js when in the dr-scripts package', () => {
  mockPkg({
    package: {
      name: 'dr-scripts',
    },
  })

  expect(require('../utils.js').resolveDrScripts()).toBe(
    require.resolve('../').replace(process.cwd(), '.'),
  )
})

test('resolveDrScripts resolves to dr-scripts if not in the dr-scripts package', () => {
  mockPkg({package: {name: 'not-dr-scripts'}})
  whichSyncMock.mockImplementationOnce(() => require.resolve('../'))

  expect(require('../utils.js').resolveDrScripts()).toBe('dr-scripts')
})

test(`resolveBin resolves to the full path when it's not in $PATH`, () => {
  expect(require('../utils.js').resolveBin('cross-env')).toBe(
    require.resolve('cross-env/src/bin/cross-env').replace(process.cwd(), '.'),
  )
})

test(`resolveBin resolves to the binary if it's in $PATH`, () => {
  whichSyncMock.mockImplementationOnce(() =>
    require.resolve('cross-env/src/bin/cross-env').replace(process.cwd(), '.'),
  )

  expect(require('../utils.js').resolveBin('cross-env')).toBe('cross-env')
  expect(whichSyncMock).toHaveBeenCalledTimes(1)
  expect(whichSyncMock).toHaveBeenCalledWith('cross-env')
})

describe('for Windows', () => {
  let realpathSync

  beforeEach(() => {
    jest.doMock('fs', () => ({
      realpathSync: jest.fn(),
    }))

    realpathSync = require('fs').realpathSync
  })

  afterEach(() => {
    jest.unmock('fs')
  })

  test('resolveBin resolves to .bin path which returns a Windows-style cmd', () => {
    const fullBinPath = '\\project\\node_modules\\.bin\\concurrently.CMD'

    realpathSync.mockImplementation(() => fullBinPath)

    expect(require('../utils.js').resolveBin('concurrently')).toBe(fullBinPath)
    expect(realpathSync).toHaveBeenCalledTimes(2)
  })
})

test('parseEnv parses the existing environment variable', () => {
  const globals = {
    react: 'React',
    'prop-types': 'PropTypes',
  }

  process.env.BUILD_GLOBALS = JSON.stringify(globals)

  expect(require('../utils.js').parseEnv('BUILD_GLOBALS')).toEqual(globals)

  delete process.env.BUILD_GLOBALS
})

test(`parseEnv returns the default if the environment variable doesn't exist`, () => {
  const defaultVal = {hello: 'world'}

  expect(require('../utils.js').parseEnv('DOES_NOT_EXIST', defaultVal)).toBe(
    defaultVal,
  )
})

test('ifAnyDep returns the true argument if true and false argument if false', () => {
  mockPkg({package: {peerDependencies: {react: '*'}}})
  const t = {a: 'b'}
  const f = {c: 'd'}

  expect(require('../utils.js').ifAnyDep('react', t, f)).toBe(t)
  expect(require('../utils.js').ifAnyDep('preact', t, f)).toBe(f)
})

test('ifAnyDep works with arrays of dependencies', () => {
  mockPkg({package: {peerDependencies: {react: '*'}}})
  const t = {a: 'b'}
  const f = {c: 'd'}

  expect(require('../utils.js').ifAnyDep(['preact', 'react'], t, f)).toBe(t)
  expect(require('../utils.js').ifAnyDep(['preact', 'webpack'], t, f)).toBe(f)
})

test('hasLocalConfig returns true if a local configuration found', () => {
  mockCosmiconfig({
    config: {},
    filepath: 'path/to/config',
  })

  expect(require('../utils.js').hasLocalConfig('module')).toBe(true)
})

test('hasLocalConfig returns true if a local config found and it is empty', () => {
  mockCosmiconfig({isEmpty: true})

  expect(require('../utils.js').hasLocalConfig('module')).toBe(true)
})
