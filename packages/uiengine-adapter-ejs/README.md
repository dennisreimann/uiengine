# UIengine template adapter for EJS

🚦 *State:* Production ready

## Configuration

Plain and simple:

```yaml
adapters:
  ejs: uiengine-adapter-ejs
```

With options:

```yaml
adapters:
  ejs:
    module: uiengine-adapter-ejs
    options:
      debug: true
```

The options are passed to the [EJS renderer](https://www.npmjs.com/package/ejs#options).

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.
