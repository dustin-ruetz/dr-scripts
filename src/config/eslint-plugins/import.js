module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-unresolved': ['error', {amd: true, commonjs: true}],
    'import/order': 'error',
    'import/prefer-default-export': 'error',
  },
}
