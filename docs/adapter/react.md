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
```

Right now there is only the option `debug` for a more detailed output in case of rendering errors.
