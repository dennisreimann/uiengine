# UIengine User Interface

## Configuration

This is what the options and their defaults look like:

```js
// TODO: Refactor "theme" to "UI"
{
  theme: {
    module: '@uiengine/ui'
    options: {
      lang: 'en',
      hljs: 'atom-one-dark',
      customStylesFile: '/custom-styles-file.css',
      debug: false,
      cache: true
    }
  }
}
```

### `lang`

Localization language for the interface. Available options:

- `en` (default)
- `de`

Feel free to send a pull request with additional [localizations](../packages/ui/src/locales)!

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
