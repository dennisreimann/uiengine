const { resolve } = require('path')

const [clientConfig, serverConfig] = require('./webpack.conf')
const serverRenderPath = resolve(__dirname, 'server-render.js')
const clientRenderPath = resolve(__dirname, 'client-render.js')
const extensions = ['js', 'jsx']

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  extensions
}
