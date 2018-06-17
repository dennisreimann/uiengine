# UIengine template adapter for React/JSX

🚦 *State:* Proof of concept

## Configuration

Plain and simple:

```yaml
adapters:
  jsx: @uiengine/adapter-react
```

With options:

```yaml
adapters:
  jsx:
    module: @uiengine/adapter-react
    options:
      debug: true
      # babel options that get passed to
      # `require('babel-register')()
      # default: none
      babel:
        presets:
          - @babel/preset-env
          - @babel/preset-stage-2
          - @babel/preset-react
        plugins:
          - css-modules-transform
```

The `debug` option allows for a more detailed output in case of rendering errors.
