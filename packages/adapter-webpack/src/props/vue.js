const transformProperties = (props, debugInfo) => {
  if (Array.isArray(props)) {
    return props.reduce((result, key) => Object.assign(result, { [key]: {} }), {})
  }

  return Object.keys(props).reduce((result, key) => {
    let { type, required, description, default: defaultValue } = props[key]
    if (!type) type = props[key] // basic prop definition, e.g. { name: String }

    const definition = { type: (typeof type === 'function') ? type.name : type }

    if (required) definition.required = required
    if (description) definition.description = description
    if (defaultValue) definition.default = defaultValue

    return { ...result, [key]: definition }
  }, {})
}

const extractProperties = (filePath, module) => {
  const components = Object.values(module).filter(m => m.props)

  return components.reduce((result, Component) => {
    const { name, props } = Component
    const componentName = name || 'Component'

    // only set if there are actual properties defined
    if (Object.keys(props).length) {
      result[`<${componentName}>`] = transformProperties(props, { componentName, filePath })
    }

    return result
  }, {})
}

module.exports = extractProperties
