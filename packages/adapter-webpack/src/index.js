
const htmlescape = require('htmlescape')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')
const { buildSetup, buildQueued, getExtractProperties } = require('./util')

async function setup (options) {
  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options

  if (!!serverConfig !== !!serverRenderPath) {
    console.warn('Webpack: Please specify both serverConfig and serverRenderPath')
  }

  if (!!clientConfig !== !!clientRenderPath) {
    console.warn('Webpack: Please specify both clientConfig and clientRenderPath')
  }

  await buildSetup(options)
}

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
  const { serverRenderPath, serverComponentPath, clientRenderPath, clientComponentPath } = await buildQueued(options, filePath, true)

  if (serverRenderPath && serverComponentPath) {
    const ServerRender = require(serverRenderPath)
    const ServerComponent = require(serverComponentPath)
    const serverRender = ServerRender.default || ServerRender
    const serverComponent = ServerComponent.default || ServerComponent
    rendered = await serverRender(serverComponent, data)
  }

  if (clientRenderPath && clientComponentPath) {
    foot = `
      <script src="${clientRenderPath}"></script>
      <script src="${clientComponentPath}"></script>
      <script>
        window.UIengineWebpack_render(
          window.UIengineWebpack_component,
          ${htmlescape(data)}
        )
      </script>`
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
  setup,
  render,
  registerComponentFile,
  filesForComponent,
  filesForVariant
}
