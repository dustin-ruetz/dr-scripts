const config = require('../react.js')

test('configuration', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify the environment is the browser
  expect(config.env.browser).toEqual(true)
  // verify that all plugins are present
  expect(config.plugins.length).toEqual(2)
  // verify that the plugins are in the correct order
  expect(config.plugins[0]).toEqual('react')
  expect(config.plugins[1]).toEqual('react-hooks')
  // verify the modification to the recommended rules
  expect(config.rules['react/no-unsafe']).toEqual('warn')
  // verify the version is set to automatic detection
  expect(config.settings.react.version).toEqual('detect')
})
