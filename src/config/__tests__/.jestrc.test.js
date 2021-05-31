const config = require('../.jestrc.js')

test('Jest config', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
})
