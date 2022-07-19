// eslint-disable-next-line no-unused-vars
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export default (Component, props) => {
  const app = document.getElementById('app')
  hydrateRoot(app, React.createElement(Component, props))
}
