#!/usr/bin/env node

const nodeVersion = {
  full: process.version,
  major: function() {
    return Number(this.full.replace('v', '').split('.')[0])
  },
  // minimum required Node.js version to run dr-scripts
  minimum: 8,
}

let shouldThrow

try {
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === 'dr-scripts' &&
    nodeVersion.major() < nodeVersion.minimum
} catch (error) {
  // ignore error
}

if (shouldThrow) {
  throw new Error(
    `You are currently using Node.js ${nodeVersion.full}.\n` +
      `You must use Node.js v${nodeVersion.minimum} or later to run the scripts ` +
      'in this package because it runs the untranspiled code directly.',
  )
}

require('./run-script.js')
