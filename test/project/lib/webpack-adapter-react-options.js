const { resolve } = require('path')

const [clientConfig, serverConfig] = require('../webpack/react.conf')
const { filesForComponent, filesForVariant } = require('./react-scaffolding')
const serverRenderPath = resolve(__dirname, 'react-server-render.js')
const clientRenderPath = resolve(__dirname, 'react-client-render.js')
const properties = 'prop-types'

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  properties,
  filesForComponent,
  filesForVariant
}
