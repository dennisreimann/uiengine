# UIengine template adapter for Marko

🚦 *State:* Proof of concept

## Configuration

Plain and simple:

```yaml
adapters:
  marko: uiengine-adapter-marko
```

With options:

```yaml
adapters:
  marko:
    module: uiengine-adapter-marko
    options:
      debug: true
```

The `debug` option allows for a more detailed output in case of rendering errors.
