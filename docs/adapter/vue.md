# Vue

🚦 *State:* Deprecated, please use the [Webpack adapter](/adapters/webpack/).

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-vue.svg)](https://www.npmjs.com/package/@uiengine/adapter-vue)

## Configuration

Plain and simple:

```js
{
  adapters: {
    vue: '@uiengine/adapter-vue'
  }
}
```

With options:

```js
{
  adapters: {
    vue: {
      module: '@uiengine/adapter-vue',
      options: {
        debug: true,
        bundle: '/absolute-path-to/server-side-bundle.js'
      }
    }
  }
}
```

The `debug` option allows for a more detailed output in case of rendering errors.

The `bundle` option should be the absolute path to a module that exports a factory function for new Vue instances.
This function should accepts an object with options that are passed into the new Vue instance:

```js
export default function createApp (options = {}) {
  const opts = Object.assign({
    // provide all components that are needed for variant previews
    components: {
      MyLabel,
      MyInput,
      MyEtcetera
    }
  }, options)

  return new Vue(opts)
}
```

See the [sample project vue folder](../../test/project/src/vue) for examples.
