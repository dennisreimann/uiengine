const { resolve } = require('path')

const [clientConfig, serverConfig] = require('./webpack.config')
const { filesForComponent, filesForVariant } = require('./scaffolding')
const serverRenderPath = resolve(__dirname, 'server-render.js')
const clientRenderPath = resolve(__dirname, 'client-render.js')
const extensions = ['js', 'vue']
const properties = 'vue'

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  extensions,
  properties,
  filesForComponent,
  filesForVariant
}
