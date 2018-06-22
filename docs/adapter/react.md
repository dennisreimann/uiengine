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
      # the babel register module that is used.
      # default: 'babel-register'
      babelRegisterModule: @babel/register
      # babel options that get passed to
      # `require('babel-register')()
      # default: none
      babel:
        presets:
          - @babel/preset-env
          - @babel/preset-stage-2
          - @babel/preset-react
        plugins:
          - css-modules-transform
```

The `debug` option allows for a more detailed output in case of rendering errors.

## Hooks and Extension

In case this adapter does not fully meet your needs you can customize and extend it.

For instance it offers the hook function `wrapElementBeforeRender(Element)` which can be overwritten.

To do so, define your own adapter which imports this one and overrides the functions that need customization:

```js
const ReactAdapter = require('@uiengine/adapter-react')
const { createElement } = require('react')
const { RoutesContext, UIENGINE_ROUTES } = require('../routes')

// wrap all components and templates in a routes context provider.
// this way we avoid referencing it manually everywhere.
ReactAdapter.wrapElementBeforeRender = Element => {
  return data => RoutesContext.Provider({
     value: UIENGINE_ROUTES,
     children: createElement(Element, data)
  })
}

module.exports = ReactAdapter
```
