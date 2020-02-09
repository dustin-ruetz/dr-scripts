const path = require('path')
const {fromRoot, hasFile, ifAnyDep} = require('../utils.js')

const here = p => path.join(__dirname, p)

const ignores = [
  '__mocks__',
  '/__tests__/helpers/',
  '/fixtures/',
  '/node_modules/',
]

const jestConfig = {
  roots: [fromRoot('src')],
  /**
   * provide an array of globs to path(s) that we want Jest to collect coverage for
   *
   * this covers all JS files, i.e. not just the
   * files for which we have corresponding tests
   */
  collectCoverageFrom: ['**/*.+(js|jsx|ts|tsx)'],
  coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.js$'],
  coverageThreshold: {
    // set the global coverage threshold for all files where coverage is collected
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  /**
   * by default, Jest uses a browser-like environment via `jsdom`
   * here we set the environment based on the dependencies
   */
  testEnvironment: ifAnyDep(['react'], 'jsdom', 'node'),
  /**
   * test all of the specified file types:
   * 1. located in '__tests__' directories; and
   * 2. with a '.test' in the filename
   */
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '**/*.test.+(js|jsx|ts|tsx)',
  ],
  // note that `testPathIgnorePatterns` ignores '/node_modules/' by default
  testPathIgnorePatterns: [...ignores],
  testURL: 'http://localhost',
  // open the ./babel-transform.js file to see the transforms being applied
  transform: {
    '^.+\\.[j|t]sx?$': here('./babel-transform.js'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  // Jest's watch mode is pluggable, so we can install packages
  // as plugins to enhance Jest's CLI functionality
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}

if (hasFile('tests/setup-env.js')) {
  jestConfig.setupFilesAfterEnv = [fromRoot('tests/setup-env.js')]
}

module.exports = jestConfig
