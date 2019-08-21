const { FileUtil: { requireUncached } } = require('@uiengine/util')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')
const { buildQueued, renderQueued, getExtractProperties } = require('./util')

async function setup (options) {
  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options

  if (!!serverConfig !== !!serverRenderPath) {
    console.warn('Webpack: Please specify both serverConfig and serverRenderPath')
  }

  if (!!clientConfig !== !!clientRenderPath) {
    console.warn('Webpack: Please specify both clientConfig and clientRenderPath')
  }
}

async function registerComponentFile (options, filePath) {
  await buildQueued(options, filePath, true)

  const extractProperties = getExtractProperties(options)
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

async function render (options, filePath, data = {}, renderId) {
  let rendered, foot
  const { serverPath, clientPath } = await renderQueued(options, filePath, data, renderId)

  if (serverPath) {
    rendered = await requireUncached(serverPath)
  }

  if (clientPath) {
    foot = ` <script src="${clientPath}"></script>`
  }

  return { rendered, foot }
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
