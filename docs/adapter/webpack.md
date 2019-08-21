# Webpack

🚦 *State:* Production ready

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-webpack.svg)](https://www.npmjs.com/package/@uiengine/adapter-webpack)

## Configuration

This adapter needs the following options:

- `serverConfig`: The Webpack config for server-side rendering
- `serverRenderPath`: Path to file containing the server-side rendering code
- `clientConfig`: The Webpack config for client-side rendering
- `clientRenderPath`: Path to file containing the client-side rendering code
- `properties`: Optional property extraction handler (options: `prop-types`, `vue`)
- `filesForComponent` and `filesForVariant`: See the [adapter scaffolding docs](../#scaffolding) and the test project files for
  [React](https://github.com/dennisreimann/uiengine/blob/master/test/project/lib/react-scaffolding.js) and
  [Vue](https://github.com/dennisreimann/uiengine/blob/master/test/project/lib/vue-scaffolding.js).

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

### Webpack build

The adapter builds the components/variants by merging your Webpack configuration with some custom additions.
For instance you can use the `process.env.target` variable provided by the `DefinePlugin` to check whether rendering occurs on the `server` or `client`:

```js
if (process.env.target === 'client') window.doSomething()
```

The build output is stored in the `${config.target}/_webpack` directory.

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

const properties = 'vue'

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  properties
}
```

For details on the `filesForComponent` and `filesForVariant` options see the
[adapter scaffolding docs](../#scaffolding) and the accompanying
[test project file](https://github.com/dennisreimann/uiengine/blob/master/test/project/lib/vue-scaffolding.js).

The `vue-server-render.js` file might look like this:

```js
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const renderer = createRenderer({
  template: (result, context) => {
    const state = context.renderState()
    const styles = context.renderStyles()
    const scripts = context.renderScripts()

    return styles + result + state + scripts
  }
})

module.exports = function serverRender (Component, props) {
  return renderer.renderToString(
    new Vue({
      render (h) {
        return h(Component, { props })
      }
    }), { state: props }
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

const properties = 'prop-types'

module.exports = {
  serverConfig,
  clientConfig,
  serverRenderPath,
  clientRenderPath,
  properties
}
```

For details on the `filesForComponent` and `filesForVariant` options see the
[adapter scaffolding docs](../#scaffolding) and the accompanying
[test project file](https://github.com/dennisreimann/uiengine/blob/master/test/project/lib/react-scaffolding.js).

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
