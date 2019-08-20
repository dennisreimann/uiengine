// eslint-disable-next-line no-unused-vars
import React from 'react'
import { hydrate } from 'react-dom'

export default (Component, props) =>
  hydrate(
    <Component {...props} />,
    document.querySelector('#app')
  )
