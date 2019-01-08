const { resolve } = require('path')

async function setup (options, api) {
  const jsFile = resolve(__dirname, '../ui/plugin.js')

  await Promise.all([
    api.addAssetFile(jsFile),
    api.addPreviewAction(options)
  ])
}

module.exports = {
  setup
}
