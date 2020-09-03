const config = require('../import.js')

test('configuration', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify that all plugins are present
  expect(config.plugins.length).toEqual(1)
  // verify that the plugins are in the correct order
  expect(config.plugins[0]).toEqual('import')
  // verify the modification to the recommended rules
  expect(config.rules['import/no-unresolved']).toEqual([
    'error',
    {commonjs: true},
  ])
  // verify the custom rules
  expect(config.rules['import/extensions']).toEqual(['error', 'ignorePackages'])
  expect(config.rules['import/no-absolute-path']).toEqual('error')
  expect(config.rules['import/no-default-export']).toEqual('error')
  expect(config.rules['import/no-extraneous-dependencies']).toEqual('error')
  expect(config.rules['import/no-self-import']).toEqual('error')
  expect(config.rules['import/order']).toEqual('error')
  // verify the settings
  expect(config.settings['import/extensions'][0]).toEqual('js')
})
