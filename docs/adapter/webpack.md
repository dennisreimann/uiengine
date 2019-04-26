# Webpack

🚦 *State:* Experimental, Proof of Concept

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-webpack.svg)](https://www.npmjs.com/package/@uiengine/adapter-webpack)

## Configuration

This adapter needs the following options:

- `serverConfig`: The Webpack config for server-side rendering
- `serverRenderPath`: Path to file containing the server-side rendering code
- `clientConfig`: The Webpack config for clientver-side rendering
- `clientRenderPath`: Path to file containing the client-side rendering code

```js
{
  adapters: {
    vue: {
      module: '@uiengine/adapter-webpack',
      options: require('./vue-adapter-options')
    },
    jsx: {
      module: '@uiengine/adapter-webpack',
      options: require('./react-adapter-options')
    }
  }
}
```

See the [test project](https://github.com/dennisreimann/uiengine/tree/master/test/project/) `lib` and `webpack` folder for full details on how to configure the adapter.

Note: This feature requires the `<!-- uiengine:foot -->` comment to be present in the template.

### Options for Vue

The `vue-adapter-options.js` file required above might look like this:

```js
const { resolve } = require('path')

// this depends on how you handle your webpack config:
// in this case it exports an array of configs, bur you
// might as well import them from separate files.
const [clientConfig, serverConfig] = require('./webpack.conf')

// see file contents below
const serverRenderPath = resolve(__dirname, 'vue-server-render.js')
const clientRenderPath = resolve(__dirname, 'vue-client-render.js')

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath
}
```

The `vue-server-render.js` file might look like this:

```js
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const renderer = createRenderer()

module.exports = function serverRender (Component, props) {
  return renderer.renderToString(
    new Vue({
      render (h) {
        return h(Component, { props })
      }
    })
  )
}
```

The `vue-client-render.js` file might look like this:

```js
import Vue from 'vue'

export default function clientRender (Component, props) {
  return new Vue({
    el: '#app', // your app container selector defined in the uiengine preview template
    render (h) {
      return h(Component, { props })
    }
  })
}
```

### Options for React

The `react-adapter-options.js` file required above might look like this:

```js
const { resolve } = require('path')

// this depends on how you handle your webpack config:
// in this case it exports an array of configs, bur you
// might as well import them from separate files.
const [clientConfig, serverConfig] = require('./webpack.conf')

// see file contents below
const serverRenderPath = resolve(__dirname, 'react-server-render.js')
const clientRenderPath = resolve(__dirname, 'react-client-render.js')

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath
}
```

The `react-server-render.js` file might look like this:

```js
const { renderToString } = require('react-dom/server')

module.exports = function serverRender (Component, props) {
  return renderToString(Component(props))
}
```

The `react-client-render.js` file might look like this:

```js
import React from 'react'
import ReactDOM from 'react-dom'

export default function clientRender (Component, props) {
  ReactDOM.hydrate(
    React.createElement(Component, props),
    document.querySelector('#app')  // your app container defined in the uiengine preview template
  )
}
```
