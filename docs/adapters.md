# Adapters

UIengine supports multiple templating engines by abstracting them with adapters.
This offers a templating language agnostic way for rendering and additional functionality.

Adapters are registered for a particular file extension.
UIengine will `require` an adapter when it needs to process a file with the given extension.

You configure the adapters for your project in the [project configuration file](/basics/config/#adapters),
using the file extension as the adapter key:

```js
{
  adapters: {
    pug: '@uiengine/adapter-pug'
  }
}
```

You can also provide a set of adapter specifict options – see the individual adapters documentation for details:

```js
{
  adapters: {
    pug: {
      module: '@uiengine/adapter-pug',
      options: {
        pretty: true,
        basedir: './src/components'
      }
    }
  }
}
```

See the list of available adapters – either to find an existing one or for a starting point to create a custom one:

- [NPM](https://www.npmjs.com/search?q=uiengine-adapter)
- [GitHub: Core](https://github.com/dennisreimann/uiengine/tree/master/packages)
- [GitHub: Third-Party](https://github.com/search?q=topic%3Auiengine-adapter&type=Repositories)

## Adapter Modules

An adapter module has to export at least a `render` function.
In addition to that there are more optional hook functions, like `setup` and `registerComponentFile`.
There are also optional hooks for [scaffolding new components and variants](#scaffolding).

__Note:__ All of these functions are expected to work asynchronously and should return a Promise.

### Functions

All the functions get called with the adapter options that are defined in the adapter config.
This set of `opts` is also extended with the following properties:

- `components`: The absolute path of the components directory referenced in the [`config.sources.components`](/basics/config/#sources) property.
- `templates`: The absolute path of the templates directory referenced in the [`config.sources.templates`](/basics/config/#sources) property.
- `target`: The absolute path of the target directory referenced in the [`config.target`](/basics/config/#target) property.
- `ext`: The file extension of the adapter.

#### `render(opts, filePath, data)`

This function should render the file at `filePath` with the given `data` and return the rendered output.

- `opts` are the extended adapter options explained above.
  In addition to the custom options that are provided via the config, these are also present:
    - `ext` as the file extension
    - `base`, `components`, `templates` from the sources config, as well as `target`
    - `themeIds` and the current `themeId`
- `filePath` is the absolute path of the file that should be rendered.
- `data` is the `context` that is provided via the
  [variant metadata](/basics/variant/) or for
  [pages with custom templates](/basics/page/#templates).

The return value can either be a string of HTML or a structured object containing the `rendered` HTML and an optional `foot`:

- String:
    ```html
    <div>rendered html</div>
    ```

- Object:
    ```json
    {
      rendered: "<div>rendered html</div>",
      foot:
    }
    ```

    - `rendered` is required and is used to display the preview
    - `foot` optional client side rendering code that gets injected (script tag including the code)

#### `setup(opts)`

This function is called before the project gets generated.
You can use this hook to e.g. [register partials when working with Handlebars](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-handlebars/src/index.js).

#### `registerComponentFile(opts, filePath)`

This function gets called for each component file, which has an associated adapter.
Use this function to generate documentation from your components, e.g. extract properties from React PropTypes.

When generating incremental changes during development you can also use this to update the registered component files.

### Scaffolding

Adapters can also provide async functions to be used when scaffolding components and variants:

- `filesForComponent(opts, componentName)`
- `filesForVariant(opts, componentName, variantName)`

Both functions should resolve with an array containing information about the files that need to be created.
For each file the array should contain an object providing a `basename` and `data`.

Here is an example from the [Pug adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-pug/src/index.js):

```js
const filesForComponent = (opts, componentName) =>
  [
    {
      basename: `${componentName}.pug`,
      data: `mixin ${componentName}()\n  .${componentName}\n    //- TODO: implement`
    }
  ]

const filesForVariant = (opts, componentName, variantName) =>
  [
    {
      basename: `${variantName}.pug`,
      data: `+${componentName}()`
    }
  ]
```

To skip scaffolding for certain adapters, provide the `skipScaffold` option in the adapter configuration:

```js
{
  adapters: {
    pug: {
      module: '@uiengine/adapter-pug',
      options: {
        skipScaffold: true
      }
    }
  }
}
```
