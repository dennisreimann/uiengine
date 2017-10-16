# UIengine template adapter for HTML

🚦 *State:* Production ready

## Configuration

Plain and simple:

```yaml
adapters:
  html: uiengine-adapter-html
```

With options:

```yaml
adapters:
  html:
    module: uiengine-adapter-html
    options:
      basedir: ./src/components
      debug: true
```

The `basedir` option allows for referencing includes with an absolute path.

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.

## Includes

The main use case for this adapter is resolving includes, which are defined with the [SSI include command](https://www.w3.org/Jigsaw/Doc/User/SSI.html#include):

```html
<body>
  <!--#include file="header.html" -->
  <div>main content</div>
  <!--#include file="footer.html" -->
</body>
```
