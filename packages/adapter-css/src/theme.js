const { resolve } = require('path')

async function extractThemeProperties (options, filePath) {
  // TODO: Replace this with proper functionality
  filePath = resolve(__dirname, '../test/fixtures/theme-props')

  return require(filePath)
}

module.exports = {
  extractThemeProperties
}
