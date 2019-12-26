if (process.argv.includes('--browser')) {
  // eslint-disable-next-line no-console
  console.error('The --browser flag has been deprecated, use --bundle instead.')
}

if (process.argv.includes('--bundle') || process.argv.includes('--browser')) {
  require('./rollup.js')
} else {
  require('./babel.js')
}
