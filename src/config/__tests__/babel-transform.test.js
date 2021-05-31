const babelTransform = require('../babel-transform.js')

test('Babel transformer', () => {
  // verify that the Babel transformer is an object
  expect(typeof babelTransform).toEqual('object')
})
