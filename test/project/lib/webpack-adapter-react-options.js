const { resolve } = require('path')

const [clientConfig, serverConfig] = require('../webpack/react.conf')
const serverRenderPath = resolve(__dirname, 'react-server-render.js')
const clientRenderPath = resolve(__dirname, 'react-client-render.js')

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath
}
