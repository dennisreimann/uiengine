const { readFile } = require('fs-extra')
const reactDocs = require('react-docgen')
const {
  StringUtil: { upcaseFirstChar }
} = require('@uiengine/util')

const extractPropertyDisplayType = type => {
  if (type) {
    if (type.value) {
      if (type.value instanceof Array) {
        return type.value
          .map(subType => extractPropertyDisplayType(subType))
          .join('|')
          .replace(/["']/g, '')
      } else if (type.value instanceof Object) {
        if (type.name === 'arrayOf') {
          return `[${extractPropertyDisplayType(type.value)}]`
        } else if (type.name === 'shape') {
          return `{${Object.keys(type.value).map(key =>
            `${key}:${extractPropertyDisplayType(type.value[key])}`
          ).join(', ')}}`
        } else {
          return extractPropertyDisplayType(type.value)
        }
      } else {
        return upcaseFirstChar(type.value)
      }
    } else if (type.name) {
      if (type.name === 'custom' && type.raw && type.raw.match(/^\w+$/)) {
        return upcaseFirstChar(type.raw)
      }
      return upcaseFirstChar(type.name)
    }
  } else {
    return null
  }
}

async function extractProperties (filePath) {
  const source = await readFile(filePath, 'utf-8')

  const resolver = reactDocs.resolver.findAllExportedComponentDefinitions
  let reactDefinitions
  try {
    reactDefinitions = reactDocs.parse(source, resolver)
  } catch (err) {
    reactDefinitions = []
  }

  const uieProperties = reactDefinitions.reduce((result, reactDefinition) => {
    const reactProps = reactDefinition.props || {}
    const uiengineProps = Object.keys(reactProps).reduce((component, propertyKey) => {
      const { type, description, required, defaultValue } = reactProps[propertyKey]

      component[propertyKey] = {
        type: extractPropertyDisplayType(type),
        default: defaultValue && defaultValue.value.replace(/["']/g, ''),
        description,
        required
      }

      return component
    }, {})

    // only set if there are actual properties defined
    if (Object.keys(uiengineProps).length) {
      result[`<${reactDefinition.displayName}>`] = uiengineProps
    }

    return result
  }, {})

  return uieProperties
}

module.exports = {
  extractProperties
}
