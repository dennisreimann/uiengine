import React from 'react'
import ReactDOM from 'react-dom'

export default function clientRender (Component, props) {
  ReactDOM.hydrate(
    React.createElement(Component, props),
    document.querySelector('#app')
  )
}
