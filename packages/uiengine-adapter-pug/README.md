# UIengine template adapter for Pug

🚦 *State:* Production ready

## Configuration

Plain and simple:

```yaml
adapters:
  pug: uiengine-adapter-pug
```

With options:

```yaml
adapters:
  pug:
    module: uiengine-adapter-pug
    options:
      pretty: true
      basedir: ./src/components
```

For available options see the [Pug options reference](https://pugjs.org/api/reference.html#options).

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.
