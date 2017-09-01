# UIengine template adapter for Handlebars

🚦 *State:* Proof of concept

## Configuration

Plain and simple:

```yaml
adapters:
  hbs: uiengine-adapter-handlebars
```

With options:

```yaml
adapters:
  hbs:
    module: uiengine-adapter-handlebars
    options:
      namespace: 'myapp'
```

Available options:

- `namespace` prefixes partials with the given namespace and a slash: `myapp/component`

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.
