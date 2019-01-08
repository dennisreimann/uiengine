const { resolve } = require('path')

async function setup (options, api) {
  const jsFile = resolve(__dirname, '../ui/plugin.js')
  const axeFile = require.resolve('axe-core/axe.min.js')

  await Promise.all([
    api.addAssetFile(jsFile),
    api.addAssetFile(axeFile, { iframe: true }),
    api.addPreviewTab(options)
  ])
}

module.exports = {
  setup
}
