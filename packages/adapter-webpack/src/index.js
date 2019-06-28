
const htmlescape = require('htmlescape')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')
const { buildQueued, getExtractProperties } = require('./util')

async function registerComponentFile (options, filePath) {
  await buildQueued(options, filePath, true)

  const extractProperties = getExtractProperties(options, filePath)

  const [properties, dependentFiles, dependencyFiles] = await Promise.all([
    extractProperties(options, filePath),
    extractDependentFiles(options, filePath),
    extractDependencyFiles(options, filePath)
  ])

  const info = {}
  if (Object.keys(properties).length > 0) info.properties = properties
  if (Object.keys(dependentFiles).length > 0) info.dependentFiles = dependentFiles
  if (Object.keys(dependencyFiles).length > 0) info.dependencyFiles = dependencyFiles

  return info
}

async function render (options, filePath, data = {}) {
  let rendered, foot
  const { serverRender, serverComponent, clientRender, clientComponent } = await buildQueued(options, filePath, true)

  if (serverRender && serverComponent) {
    const Component = serverComponent.default || serverComponent
    rendered = await serverRender(Component, data)
  }

  if (clientRender && clientComponent) {
    const render = `(function() {
        var ClientRenderModule = ${clientRender};
        var ComponentModule = ${clientComponent};
        var clientRender = ClientRenderModule.default || ClientRenderModule;
        var Component = ComponentModule.default || ComponentModule;
        clientRender(Component, ${htmlescape(data)});
      })();`
    const script = `data:text/javascript;base64,${Buffer.from(render).toString('base64')}`
    foot = `<script title="Webpack Adapter Client-Side Rendering" src="${script}"></script>`
  }

  return {
    rendered,
    foot
  }
}

function filesForComponent (options, componentName) {
  const fn = options.filesForComponent
  if (typeof fn === 'function') return fn(options, componentName)
}

function filesForVariant (options, componentName, variantName) {
  const fn = options.filesForVariant
  if (typeof fn === 'function') return fn(options, componentName, variantName)
}

module.exports = {
  render,
  registerComponentFile,
  filesForComponent,
  filesForVariant
}
