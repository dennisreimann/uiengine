# UIengine default theme

## ⚙️ Configuration

This is what the options and their defaults look like:

```yaml
theme:
  module: uiengine-theme-default
  options:
    lang: en
    skin: default
    hljs: atom-one-dark
    debug: false
    cache: true
```

### `lang`

Localization language for the interface. Available options:

- `en` (default)
- `de`

Feel free to send a pull request with additional [localizations](https://github.com/dennisreimann/uiengine-theme-default/tree/master/src/locales)!


### `skin`

The color scheme for the interface. Available options:

- [`default`](./docs/media/skin-default.png) (default)
- [`deeplake`](./docs/media/skin-deeplake.png)
- [`uiengineering`](./docs/media/skin-uiengineering.png)

### `hljs`

The highlight.js theme for the code blocks, defaults to `atom-one-dark`.
For a list of available options see the [highlight.js demo](https://highlightjs.org/static/demo/).

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

## 🛠 Development

You like to improve the theme and are interested in participating?
See the [development docs](./docs/development.md) for an introduction and workflows when hacking on the UIengine default theme.

In case you want to customize the theme you can use this repository as a starting point.
