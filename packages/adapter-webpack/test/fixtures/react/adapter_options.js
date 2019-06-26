const { resolve } = require('path')

const [clientConfig, serverConfig] = require('./webpack.config')
const serverRenderPath = resolve(__dirname, 'server-render.js')
const clientRenderPath = resolve(__dirname, 'client-render.js')
const extensions = ['js', 'jsx']
const properties = 'prop-types'

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  extensions,
  properties
}
