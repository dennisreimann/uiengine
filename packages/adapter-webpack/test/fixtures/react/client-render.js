import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export default function clientRender (Component, props) {
  const app = document.getElementById('app')
  hydrateRoot(app, React.createElement(Component, props))
}
