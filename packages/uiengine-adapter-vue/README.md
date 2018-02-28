# UIengine template adapter for Vue.js

🚦 *State:* Proof of concept

## Configuration

Plain and simple:

```yaml
adapters:
  vue: uiengine-adapter-vue
```

With options:

```yaml
adapters:
  vue:
    module: uiengine-adapter-vue
    options:
      debug: true
      bundle: /absolute-path-to/server-side-bundle.js
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