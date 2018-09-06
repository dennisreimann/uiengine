# React

🚦 *State:* Production ready

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-react.svg)](https://www.npmjs.com/package/@uiengine/adapter-react)

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
      # default: '@babel/register'
      babelRegisterModule: @babel/register
      # babel options that get passed to
      # `require('@babel/register')()
      # default: none
      babel:
        presets:
          - @babel/preset-env
          - @babel/preset-react
        plugins:
          - css-modules-transform
```

The `debug` option allows for a more detailed output in case of rendering errors.

## Hooks and Extension

In case this adapter does not fully meet your needs you can customize and extend it.

For instance it offers these hook functions which can be overwritten:

- `wrapElementBeforeRender(Element, filePath, data)`
- `wrapHtmlAfterRender(html, filePath, data)`

To do so, define your own adapter which imports this one and overrides the functions that need customization:

```js
const ReactAdapter = require('@uiengine/adapter-react')
const { readFileSync } = require('fs')
const { resolve, join } = require('path')
const { createElement } = require('react')
const { MyContext, MY_CONTEXT_VALUE } = require('../routes')

// wrap all components and templates in a context provider.
ReactAdapter.wrapElementBeforeRender = (Element, filePath, data) => {
  return (props, children) =>
    createElement(MyContext.Provider, {
      value: MY_CONTEXT_VALUE,
      children: createElement(Element, props, children)
    })
}

// wrap all templates in the preview templates to provide the full html page.
const templatesPath = resolve(__dirname, '..', 'templates')
const templatePath = join(templatesPath, 'uiengine.html')
const template = readFileSync(templatePath, 'utf-8')

ReactAdapter.wrapHtmlAfterRender = (html, filePath, data) => {
  if (filePath.startsWith(templatesPath)) {
    let wrapped = template
    wrapped = wrapped.replace(`<!-- uiengine:class -->`, data.class)
    wrapped = wrapped.replace(`<!-- uiengine:title -->`, data.title)
    wrapped = wrapped.replace(`<!-- uiengine:content -->`, html)
    return wrapped
  } else {
    return html
  }
}

module.exports = ReactAdapter
```
