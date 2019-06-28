const { StringUtil: { upcaseFirstChar } } = require('@uiengine/util')

const filesForComponent = (options, componentName) => {
  const upcasedComponentName = upcaseFirstChar(componentName)

  return [
    {
      basename: `${upcasedComponentName}.jsx`,
      data: `
import React from 'react'

const ${upcasedComponentName} = props => {
  return (
    <div className='${componentName}'>
      {props.children}
    </div>
  )
}

export default ${upcasedComponentName}`

    }
  ]
}

const filesForVariant = (options, componentName, variantName) => {
  const upcasedComponentName = upcaseFirstChar(componentName)
  const upcasedVariantName = upcaseFirstChar(variantName)

  return [
    {
      basename: `${upcasedVariantName}.jsx`,
      data: `
import React from 'react'
import ${upcasedComponentName} from '../${upcasedComponentName}.jsx'

export default props => (
  <${upcasedComponentName} {...props} />
)`
    }
  ]
}

module.exports = {
  filesForComponent,
  filesForVariant
}
