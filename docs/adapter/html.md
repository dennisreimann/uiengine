# UIengine adapter for HTML

🚦 *State:* Production ready

## Configuration

Plain and simple:

```yaml
adapters:
  html: @uiengine/adapter-html
```

With options:

```yaml
adapters:
  html:
    module: @uiengine/adapter-html
    options:
      basedir: ./src/components
      debug: true
```

The `basedir` option allows for referencing includes with an absolute path.

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.

## Variables

You can reference variables with the JavaScript template literal syntax:

```html
<div>${myData.variable}</div>
```

Given the context `{ myData: { variable: 'Test' } }` this would render like

```html
<div>Test</div>
```

## Includes

You can include other html templates/components using the [SSI include command](https://www.w3.org/Jigsaw/Doc/User/SSI.html#include):

```html
<body>
  <!--#include file="header.html" -->
  <div>main content</div>
  <!--#include file="footer.html" -->
</body>
```

Variables and includes can also be combined:

```html
<body>
  <!--#include file="${myIncludeFile}" -->
</body>
```
