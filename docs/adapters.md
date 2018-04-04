# Adapters

UIengine supports adapters for rendering to support multiple templating engines and to offer a template agnostic way for rendering.

Adapters are registered for a particular file extension.
UIengine will `require` an adapter when it needs to process a file with the given extension.

You configure the adapters for your project in the [project configuration file](./config.md),
using the file extension as the adapter key.

## Adapter Modules

A templating adapter module has to export an async `render` function:

- `render(opts, filePath, data)` gets the adapter options, the path to the file that should get
  rendered and the data to render it with.
  This function is called asynchronously and has to return a `Promise`!
  The incoming `data` depends on the file that gets rendered:
  For variants this is the context that is provided via the [variant metadata](./variant.md).

In addition to that there is an **optional hooks for `registerComponentFile`**.
You can use this hook to i.e. register partials when working with Handlebars:

- `registerComponentFile()` gets called before the project gets generated.
  When generating incremental changes during development you can use this to update the
  registered cpomponent files as this hook gets called with changed files too.

In case you provided this hook, make sure to return a `Promise`!

See the list of available adapters (on [NPM](https://www.npmjs.com/search?q=uiengine-adapter) or [GitHub](https://github.com/dennisreimann/uiengine/tree/master/packages)) either to find an existing one or for a starting point to create a custom one.

## Scaffolding

Adapters can also provide async functions to be used when scaffolding components and variants:

- `filesForComponent(componentName)`
- `filesForVariant(componentName, variantName)`

Both functions should resolve with an array containing information about the files that need to be created.
For each file the array should contain an object providing a `basename` and `data`.

Here is an example from the [Pug adapter](https://github.com/dennisreimann/uiengine/packages/uiengine-adapter-pug/blob/master/src/index.js):

```js
const filesForComponent = (componentName) =>
  [
    {
      basename: `${componentName}.pug`,
      data: `mixin ${componentName}()\n  .${componentName}\n    //- TODO: implement\n`
    }
  ]

const filesForVariant = (componentName, variantName) =>
  [
    {
      basename: `${variantName}.pug`,
      data: `+${componentName}()\n`
    }
  ]
```
