const config = require('../.commitlintrc.js')

test('commitlint config', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify that its key/value pairs are of the correct type
  expect(Array.isArray(config.extends)).toEqual(true)
  expect(config.extends.length).toEqual(1)
})
