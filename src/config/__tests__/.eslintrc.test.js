const config = require('../.eslintrc.js')

test('ESLint config', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify that its key/value pairs are of the correct type
  expect(typeof config.env).toEqual('object')
  expect(Array.isArray(config.extends)).toEqual(true)
  expect(config.extends.length).toBeGreaterThanOrEqual(2)
  expect(typeof config.parserOptions).toEqual('object')
  expect(typeof config.rules).toEqual('object')
})
