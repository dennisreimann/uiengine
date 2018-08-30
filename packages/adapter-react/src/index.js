const { renderToString } = require('react-dom/server')
const { extractProperties } = require('./util')
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
  const babelRegisterModule = options.babelRegisterModule || 'babel-register'
  const babel = options.babel || {}

  require(babelRegisterModule)(babel)
}

async function registerComponentFile (options, filePath) {
  invalidateRequireCache(filePath)

  const properties = extractProperties(filePath)

  return Object.keys(properties).length ? { properties } : null
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

function filesForComponent (componentName) {
  const name = upcaseFirstChar(componentName)

  return [
    {
      basename: `${name}.jsx`,
      data: `import React from 'react'

const ${name} = props => {
  return (
    <div className='${componentName}'>
      {props.children}
    </div>
  )
}

export default ${name}
`
    }
  ]
}

function filesForVariant (componentName, variantName) {
  const cName = upcaseFirstChar(componentName)
  const vName = upcaseFirstChar(variantName)

  return [
    {
      basename: `${vName}.jsx`,
      data: `import React from 'react'
import ${cName} from '../${cName}.jsx'
import { wrapElementBeforeRender } from './index';

export default props => (
  <${cName} />
)
`
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
