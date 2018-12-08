module.exports = (upcasedComponentName) => `
import React from 'react'
import ${upcasedComponentName} from '../${upcasedComponentName}.jsx'

export default props => (
  <${upcasedComponentName} {...props} />
)`
