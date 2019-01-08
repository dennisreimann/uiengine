# Plugins

You configure the plugins for your project in the [project configuration file](/basics/config/):

```js
{
  plugins: [
    {
      module: '@uiengine/plugin-preview-toggle-class'
    }
  }
}
```

You can also provide a set of options – see the individual plugins documentation for details:

```js
{
  plugins: [
    {
      module: '@uiengine/plugin-preview-toggle-class',
      options: {
        title: 'Toggle Grid',
        selector: 'body',
        className: 'show-grid'
      }
    }
  ]
}
```

See the list of available plugins – either to find an existing one or for a starting point to create a custom one:

- [NPM](https://www.npmjs.com/search?q=uiengine-plugin)
- [GitHub: Core](https://github.com/dennisreimann/uiengine/tree/master/packages)
- [GitHub: Third-Party](https://github.com/search?q=topic%3Auiengine-plugin&type=Repositories)

## Plugin Modules

A plugin module has to export at least a `setup` function.

### Functions

All the functions get called with the plugin options that are defined in the plugin config.

__Note:__ All of these functions are expected to work asynchronously and should return a Promise.

#### `setup(opts, api)`

This function is called on project initialization.
You can use this hook to configure your plugins features via the `api`.

TODO: [API description](https://github.com/dennisreimann/uiengine/blob/plugins/packages/core/src/plugin.js)
