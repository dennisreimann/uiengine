# Theme

UIengine ships with a default theme to get you started quickly.

## Configuring the default theme

This is what the options and their defaults look like:

```yaml
theme:
  module: @uiengine/theme
  options:
    lang: en
    hljs: atom-one-dark
    customStylesFile: /custom-styles-file.css
    debug: false
    cache: true
```

### `lang`

Localization language for the interface. Available options:

- `en` (default)
- `de`

Feel free to send a pull request with additional [localizations](../packages/theme/src/locales)!

### `hljs`

The highlight.js theme for the code blocks, defaults to `atom-one-dark`.
For a list of available options see the [highlight.js demo](https://highlightjs.org/static/demo/).

### `customStylesFile`

The path to a css files containing variable overrides and extensions for the theme.
For an example see the [custom styles file of the test project](../test/project/src/assets/styles/uiengine-custom-styles.css).

### `base`

Sets the base path for the output.
Defaults to `/`.

### `debug`

Enable debug output, most likely to be used during theme development.

Available options:

- `false` (default)
- `true`

### `cache`

Enable template cache, most likely to be disabled during theme development.

Available options:

- `true` (default)
- `false`

## Deployment

See the [deployment docs](./deployment.md) for details.

## Custom theme

If you want to use your own theme instead of the default one, there are two options:

- provide the path to a directory inside this project that contains the theme
  (case: you use the theme just for this project)
- give the name of the npm package that is the theme
  (case: you use the theme more than once and want to share it across projects)

UIengine will `require` the theme.
The module has to export an async `render` functions:

- `render(options, state)` gets the theme options and the complete state object for the pages that should get rendered.
  This function is called asynchronously and has to return a `Promise`!

In addition to that there are **optional hooks for `setup` and `teardown`**.
You can use the setup hook to create a template cache with precompiled templates that `render` can use.
This makes sense when you are working with i.e. Handlebars and you have to register partials and helpers.
You might also want to copy the themes assets to the `target` path in the `setup` function.

Apart from that you most likely will not need to provided these hooks.
But if you do, make sure to return a `Promise`:

- `setup(options)` hook for initializing the theme.
  Gets called before the project gets generated.
- `teardown(options)` hook to undo everything that happened during setup.
  This is not used by UIengine itself but you might need this in tests for the theme.

This actually sounds more complicated than it really is.
To see how it actually works have a look at the [default theme](https://github.com/dennisreimann/uiengine/packages/theme).
