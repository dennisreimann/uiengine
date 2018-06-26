# Adapters

UIengine supports multiple templating engines by abstracting them with adapters.
This offers a templating language agnostic way for rendering and additional functionality.

Adapters are registered for a particular file extension.
UIengine will `require` an adapter when it needs to process a file with the given extension.

You configure the adapters for your project in the [project configuration file](./config.md#adapters),
using the file extension as the adapter key:

```js
{
  adapters: {
    jsx: '@uiengine/adapter-react'
  }
}
```

You can also provide a set of adapter specific options – see the individual adapters documentation for details:

```js
{
  adapters: {
    jsx: {
      module: '@uiengine/adapter-react',
      options: {
        babel: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-stage-2',
            '@babel/preset-react'
          ],
          plugins: [
            'css-modules-transform'
          ]
        }
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

- `components`: The absolute path of the components directory referenced in the [`config.sources.components`](./config.md#sources) property.
- `templates`: The absolute path of the templates directory referenced in the [`config.sources.templates`](./config.md#sources) property.
- `target`: The absolute path of the target directory referenced in the [`config.target`](./config.md#target) property.
- `ext`: The file extension of the adapter.

#### `render(opts, filePath, data)`

This function should render the file at `filePath` with the given `data` and return the rendered output.

- `opts` are the extended adapter options explained above.
- `filePath` is the absolute path of the file that should be rendered.
- `data` is the `context` that is provided via the
  [variant metadata](./variant.md) or for
  [pages with custom templates](./page.md#templates).

The return value can either be a string of HTML or a structured object containing the `rendered` HTML and an optional array of `parts`:

- String:
    ```html
    <div>rendered html</div>
    ```

- Object:
    ```json
    {
      rendered: "<div>rendered html</div>",
      parts: [
        {
          title: 'HTML',
          content: "<div>rendered html</div>",
          lang: 'html'
        },
        {
          title: 'CSS',
          content: "div { background: yellow; }",
          lang: 'css'
        }
      ]
    }
    ```

    - `rendered` is required and is used to display the preview
    - `parts` are optional and get displayed in the code view:
        - `title`: The title of the code block
        - `content`: The content of the code block
        - `lang`: The language of the code block, used for syntax highlighting

#### `setup(opts)`

This function is called before the project gets generated.
You can use this hook to i.e. [register partials when working with Handlebars](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-handlebars/src/index.js).

#### `registerComponentFile(opts, filePath)`

This function gets called for each component file, which has an associated adapter.
Use this function to generate documentation from your components, i.e.
[extract properties from React PropTypes](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-react/src/index.js).

When generating incremental changes during development you can also use this to update the registered component files.

### Scaffolding

Adapters can also provide async functions to be used when scaffolding components and variants:

- `filesForComponent(componentName)`
- `filesForVariant(componentName, variantName)`

Both functions should resolve with an array containing information about the files that need to be created.
For each file the array should contain an object providing a `basename` and `data`.

Here is an example from the [Pug adapter](https://github.com/dennisreimann/uiengine/tree/master/packages/adapter-pug/src/index.js):

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
