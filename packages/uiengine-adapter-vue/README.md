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
```

The `debug` option allows for a more detailed output in case of rendering errors.
