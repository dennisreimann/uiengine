const { resolve } = require('path')

const [clientConfig, serverConfig] = require('../webpack/vue.conf')
const serverRenderPath = resolve(__dirname, 'vue-server-render.js')
const clientRenderPath = resolve(__dirname, 'vue-client-render.js')

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath
}
