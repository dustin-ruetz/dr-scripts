const config = require('../pug.js')

test('configuration', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify the environment is the browser
  expect(config.env.browser).toEqual(true)
})
