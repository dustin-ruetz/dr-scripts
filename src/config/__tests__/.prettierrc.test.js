const config = require('../.prettierrc.js')

test('Prettier config', () => {
  // verify that the configuration is an object
  expect(typeof config).toEqual('object')
  // verify that its key/value pairs are of the correct type
  expect(typeof config.arrowParens).toEqual('string')
  expect(typeof config.bracketSameLine).toEqual('boolean')
  expect(typeof config.bracketSpacing).toEqual('boolean')
  expect(typeof config.jsxSingleQuote).toEqual('boolean')
  expect(typeof config.printWidth).toEqual('number')
  expect(typeof config.proseWrap).toEqual('string')
  expect(typeof config.quoteProps).toEqual('string')
  expect(typeof config.semi).toEqual('boolean')
  expect(typeof config.singleAttributePerLine).toEqual('boolean')
  expect(typeof config.singleQuote).toEqual('boolean')
  expect(typeof config.tabWidth).toEqual('number')
  expect(typeof config.trailingComma).toEqual('string')
  expect(typeof config.useTabs).toEqual('boolean')
})
