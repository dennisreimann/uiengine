# Marko

🚦 *State:* Proof of concept

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-marko.svg)](https://www.npmjs.com/package/@uiengine/adapter-marko)

## Configuration

Plain and simple:

```yaml
adapters:
  marko: @uiengine/adapter-marko
```

With options:

```yaml
adapters:
  marko:
    module: @uiengine/adapter-marko
    options:
      debug: true
      install:
        # default marko config options that get passed to
        # `require('marko/node-require').install()`
        compilerOptions:
          writeToDisk: true
```

The `debug` option allows for a more detailed output in case of rendering errors.
