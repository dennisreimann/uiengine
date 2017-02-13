# UIengine template adapter for Handlebars

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
    module: ./node_modules/uiengine-adapter-handlebars
    options:
      namespace: 'myapp'
```

Available options:

- `namespace` prefixes partials with the given namespace and a slash: `myapp/component`
