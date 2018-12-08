const { renderToString } = require('react-dom/server')
const { extractProperties } = require('./props')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')
const {
  FileUtil: { invalidateRequireCache },
  StringUtil: { upcaseFirstChar }
} = require('@uiengine/util')

// hook functions which can be overwritten by custom adapters.
function wrapElementBeforeRender (Element, filePath, data) {
  return Element
}

function wrapHtmlAfterRender (html, filePath, data) {
  return html
}

async function setup (options) {
  const babelRegisterModule = options.babelRegisterModule || '@babel/register'
  const { babel } = options

  if (babel) {
    require(babelRegisterModule)(babel)
  } else {
    require(babelRegisterModule)
  }
}

async function registerComponentFile (options, filePath) {
  invalidateRequireCache(filePath)

  const [properties, dependentFiles, dependencyFiles] = await Promise.all([
    extractProperties(filePath),
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
  invalidateRequireCache(filePath)

  let Element = require(filePath)
  if (Element.default) Element = Element.default
  Element = module.exports.wrapElementBeforeRender(Element, filePath, data)
  const vdom = Element(data)
  const html = renderToString(vdom)
  const rendered = module.exports.wrapHtmlAfterRender(html, filePath, data)

  return rendered
}

function filesForComponent (options, componentName) {
  const upcasedComponentName = upcaseFirstChar(componentName)
  const tmpl = require(`./files/component`)

  return [
    {
      basename: `${upcasedComponentName}.jsx`,
      data: tmpl(componentName, upcasedComponentName)
    }
  ]
}

function filesForVariant (options, componentName, variantName) {
  const upcasedComponentName = upcaseFirstChar(componentName)
  const upcasedVariantName = upcaseFirstChar(variantName)
  const tmpl = require(`./files/variant`)

  return [
    {
      basename: `${upcasedVariantName}.jsx`,
      data: tmpl(upcasedComponentName)
    }
  ]
}

module.exports = {
  setup,
  render,
  registerComponentFile,
  filesForComponent,
  filesForVariant,
  wrapElementBeforeRender,
  wrapHtmlAfterRender
}
