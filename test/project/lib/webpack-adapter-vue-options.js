const { resolve } = require('path')

const [clientConfig, serverConfig] = require('../webpack/vue.conf')
const { filesForComponent, filesForVariant } = require('./vue-scaffolding')
const serverRenderPath = resolve(__dirname, 'vue-server-render.js')
const clientRenderPath = resolve(__dirname, 'vue-client-render.js')
const extensions = ['vue']
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
