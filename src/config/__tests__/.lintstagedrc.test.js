const config = require('../.lintstagedrc.js')

test('lint-staged config', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
})
