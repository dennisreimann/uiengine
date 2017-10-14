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
      pretty: true
      basedir: ./src/components
```

For available options see the [Pug options reference](https://pugjs.org/api/reference.html#options).

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.
