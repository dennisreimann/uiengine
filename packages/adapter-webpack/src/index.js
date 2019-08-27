const { FileUtil: { requireUncached, relativeToCwd } } = require('@uiengine/util')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')
const { getExtractProperties } = require('./props')
const { buildQueued, renderQueued, debug } = require('./util')

async function setup (options) {
  debug(options, 'setup():start')

  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options

  if (!!serverConfig !== !!serverRenderPath) {
    console.warn('Webpack: Please specify both serverConfig and serverRenderPath')
  }

  if (!!clientConfig !== !!clientRenderPath) {
    console.warn('Webpack: Please specify both clientConfig and clientRenderPath')
  }

  debug(options, 'setup():end')
}

async function registerComponentFile (options, filePath) {
  debug(options, `registerComponentFile(${relativeToCwd(filePath)}):start`)

  await buildQueued(options, filePath)

  const extractProperties = getExtractProperties(options)
  const [properties, dependencyFiles] = await Promise.all([
    extractProperties(options, filePath),
    extractDependencyFiles(options, filePath)
  ])
  const dependentFiles = extractDependentFiles(options, filePath)

  const info = {}
  if (Object.keys(properties).length > 0) info.properties = properties
  if (Object.keys(dependentFiles).length > 0) info.dependentFiles = dependentFiles
  if (Object.keys(dependencyFiles).length > 0) info.dependencyFiles = dependencyFiles

  debug(options, `registerComponentFile(${relativeToCwd(filePath)}):end`)

  return info
}

async function render (options, filePath, data = {}, renderId) {
  debug(options, `render(${renderId}):start`)

  let rendered, foot
  const { serverPath, clientPath } = await renderQueued(options, filePath, data, renderId)

  if (serverPath) rendered = await requireUncached(serverPath)
  if (clientPath) foot = `<script src="${clientPath}"></script>`

  debug(options, `render(${renderId}):end`)

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
