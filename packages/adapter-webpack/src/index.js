
const htmlescape = require('htmlescape')
const { runWebpack, buildConfig, requireFromMemory, readFromMemory } = require('./util')

async function registerComponentFile (options, filePath) {
  // TODO: Implement strategies for the particular extract use cases.
}

async function render (options, filePath, data = {}) {
  const config = buildConfig(options, filePath)
  await runWebpack(config)

  let rendered, foot
  if (config.server) {
    const serverRender = requireFromMemory(filePath, 'serverRender.js')
    const Component = requireFromMemory(filePath, 'serverComponent.js')
    rendered = await serverRender(Component, data)
  }

  if (config.client) {
    const clientRenderJs = readFromMemory(filePath, 'clientRender.js')
    const clientComponentJs = readFromMemory(filePath, 'clientComponent.js')
    const renderJs = `(function() {
        var ClientRenderModule = ${clientRenderJs};
        var ComponentModule = ${clientComponentJs};
        var clientRender = ClientRenderModule.default || ClientRenderModule;
        var Component = ComponentModule.default || ComponentModule;
        clientRender(Component, ${htmlescape(data)});
      })();`
    const script = `data:text/javascript;base64,${Buffer.from(renderJs).toString('base64')}`
    foot = `<script title="Webpack Adapter Client-Side Rendering" src="${script}"></script>`
  }

  return {
    rendered,
    foot
  }
}

module.exports = {
  render,
  registerComponentFile
}
