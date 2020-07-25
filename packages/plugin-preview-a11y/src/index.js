const { resolve } = require('path')

async function setup (options, api) {
  const cssFile = resolve(__dirname, '../ui/plugin.css')
  const jsFile = resolve(__dirname, '../ui/plugin.js')
  const axeFile = require.resolve('axe-core/axe.min.js')

  await Promise.all([
    api.addAssetFile(cssFile),
    api.addAssetFile(jsFile),
    api.addAssetFile(axeFile, { iframe: true }),
    api.addPreviewTab(options)
  ])
}

module.exports = {
  setup
}
