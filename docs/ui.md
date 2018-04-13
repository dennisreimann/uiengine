# UIengine User Interface

## Configuration

This is what the options and their defaults look like:

```js
{
  ui: {
    lang: 'en',
    hljs: 'atom-one-dark',
    base: '/',
    customStylesFile: '/custom-styles-file.css',
    debug: false,
    cache: true

    breakpoints: {
      XS: 320,
      S: 560,
      M: 760,
      L: 960,
      XL: 1280
    },

    themes: [
      {
        id: 'default',
        title: 'Default'
      },
      {
        id: 'funky',
        title: 'Bright colors'
      }
    ]
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

The path to a css files containing variable overrides and extensions for the UI.
For an example see the [custom styles file of the test project](../test/project/src/assets/styles/uiengine-custom-styles.css).

### `base`

Sets the base path for the output.
Defaults to `/`.

### `debug`

Enable debug output, most likely to be used during UI development.

Available options:

- `false` (default)
- `true`

### `cache`

Enable template cache, most likely to be disabled during UI development.

Available options:

- `true` (default)
- `false`

### `breakpoints`

The breakpoints defined here will be shown in the preview settings.
Declare them with the name as key and the minimum media query pixel being the value.

### `themes`

The themes defined here will be shown in the topbar.

The first theme is selected by default.
The iframe is loaded with the theme id being the hash part of the url (i.e. `#funky`).

## Deployment

See the [deployment docs](./deployment.md) for details.
