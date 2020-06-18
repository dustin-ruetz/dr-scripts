const config = require('../jsx-a11y.js')

test('configuration', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify that all plugins are present
  expect(config.plugins.length).toEqual(1)
  // verify that the plugins are in the correct order
  expect(config.plugins[0]).toEqual('jsx-a11y')
})
