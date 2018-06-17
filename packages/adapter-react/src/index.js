const ReactDOMServer = require('react-dom/server')
const { extractProperties, invalidateModuleCache, upcaseFirstChar } = require('./util')

export async function setup (options) {
  const babel = options.babel || {}

  require('babel-register')(babel)
}

export async function registerComponentFile (options, filePath) {
  invalidateModuleCache(filePath)

  const properties = extractProperties(filePath)

  return Object.keys(properties).length ? { properties } : null
}

export async function render (options, filePath, data = {}) {
  try {
    invalidateModuleCache(filePath)

    let template = require(filePath)
    if (template.default) template = template.default
    const vdom = template(data)

    return ReactDOMServer.renderToString(vdom)
  } catch (err) {
    const message = [`React DOM could not render "${filePath}"!`, err]

    if (options.debug) message.push(JSON.stringify(data, null, 2))

    throw new Error(message.join('\n\n'))
  }
}

export function filesForComponent (componentName) {
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

export function filesForVariant (componentName, variantName) {
  const cName = upcaseFirstChar(componentName)
  const vName = upcaseFirstChar(variantName)

  return [
    {
      basename: `${vName}.jsx`,
      data: `import React from 'react'
import ${cName} from '../${cName}.jsx'

export default props => (
  <${cName} />
)
`
    }
  ]
}
