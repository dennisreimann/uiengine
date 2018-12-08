module.exports = (componentName, upcasedComponentName) => `
import React from 'react'

const ${upcasedComponentName} = props => {
  return (
    <div className='${componentName}'>
      {props.children}
    </div>
  )
}

export default ${upcasedComponentName}`
