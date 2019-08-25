const { default: parseProperties } = require('parse-prop-types')
const { StringUtil: { upcaseFirstChar } } = require('@uiengine/util')

const propertyDefinitionByType = (type, debugInfo) => {
  const { name, value } = type

  switch (name) {
    case 'shape': {
      const shapeValue = transformPropTypes(value, debugInfo)
      return { type: upcaseFirstChar(name), value: shapeValue }
    }
    case 'arrayOf': {
      const arrayName = value.name || 'Custom'
      const arrayValue = value.value
        ? propertyDefinitionByType(value, debugInfo)
        : upcaseFirstChar(arrayName)
      return { type: 'Array', value: arrayValue }
    }
    case 'objectOf': {
      const objectName = value.name
      const objectValue = value.value
        ? propertyDefinitionByType(value, debugInfo)
        : upcaseFirstChar(objectName)
      return { type: 'Object', value: objectValue }
    }
    case 'instanceOf': {
      return { type: value }
    }
    case 'oneOf': {
      return { type: value.map(val => `"${val}"`).join('|') }
    }
    case 'oneOfType': {
      return { type: value.map(({ name }) => upcaseFirstChar(name)).join('|') }
    }
    default: {
      return { type: upcaseFirstChar(name) }
    }
  }
}

const transformPropTypes = (propTypes, debugInfo) =>
  Object.keys(propTypes).reduce((result, key) => {
    const { type, required, description, defaultValue } = propTypes[key]
    let definition = { type }
    try {
      definition = propertyDefinitionByType(type, debugInfo)
    } catch (err) {
      const { componentName, filePath } = debugInfo
      console.error(`Error transforming prop-types for ${componentName} in ${filePath}:`, err, `\n\nProperty: ${key} =`, propTypes[key])
    }

    definition.required = required

    if (description) definition.description = description
    if (defaultValue) definition.default = defaultValue.value

    return Object.assign(result, { [key]: definition })
  }, {})

const extractProperties = (filePath, module) => {
  const components = Object.values(module).filter(m => m.propTypes)

  return components.reduce((result, Component) => {
    const componentName = Component.displayName || Component.name || 'Component'
    let properties = {}
    try {
      properties = parseProperties(Component)
    } catch (err) {
      console.error(`Error parsing properties for ${componentName} in ${filePath}:`, err)
    }

    // only set if there are actual properties defined
    if (Object.keys(properties).length) {
      result[`<${componentName}>`] = transformPropTypes(properties, { componentName, filePath })
    }

    return result
  }, {})
}

module.exports = extractProperties
