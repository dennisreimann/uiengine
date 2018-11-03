# Integrations

## Gulp

To integrate the UIengine into your Gulp build you have to add the following lines of code to your Gulpfile:

```js
const gulp = require('gulp')
const UIengine = require('@uiengine/core')

const isDev = process.env.NODE_ENV !== 'production'

gulp.task('uiengine', done => {
  const opts = {
    serve: isDev,
    watch: isDev
  }

  UIengine.build(opts)
    .then(() => { done() })
    .catch(err => { done(err) })
})
```

The `UIengine.build()` function accepts an options object with the following optional properties:

- `debug`: Debug level from `1` (basic) to `4` (very verbose) (default `0`).
- `serve`: Spawn a development server (default `false`).
- `watch`: Rebuild the site on changes (default `false`).

Note: To use the `serve` and `watch` options, you will also need to install two optional dependencies.
You can do so by adding the following packages to you projects `devDependencies`:

- `browser-sync`
- `chokidar`

In case your project has additional files that should trigger a rebuild you can pass them as a `String` or `Array` for the `watch` option:

```js
gulp.task('uiengine', done => {
  const opts = {
    serve: isDev,
    watch: isDev ? ['src/data/*.json', 'src/custom/**/*.md'] : false
  }

  UIengine.build(opts)
    .then(() => { done() })
    .catch(err => { done(err) })
})
```

## html-sketchapp

The [html-sketchapp](https://github.com/brainly/html-sketchapp) functionality is integrated via a [html-sketchapp-cli](https://github.com/seek-oss/html-sketchapp-cli) compatible export.
It generates Sketch libraries for your component variants.

The UIengine generates the `/_sketch.html` file which can be used with `html-sketchapp-cli`.

## Theo

You can integrate and consume design tokens defined with the [Theo](https://github.com/salesforce-ux/theo#spec) tokens spec.

You need the `@uiengine/bridge-theo` package for this.

The UIengine integration can be used inside a JavaScript file referenced in the `tokens` attribute:

```md
---
title: Colors
tokens: !include colors.js
---
Our colors.
```

The contents of the transforming JavaScript file look something like this:

```js
const { resolve } = require('path')
const convert = require('@uiengine/bridge-theo')

const filePath = resolve(__dirname, 'colors.yml')

module.exports = convert(filePath)
```

The transformations converts your Theo `props` into a format that can be rendered by the UIengine tokens template.
For details on the format see the [design token docs](/advanced/design-tokens/).

You can also pass a modification callback to the `convert` function.
This allows you to further modify the property data:

```js
const { resolve } = require('path')
const convert = require('@uiengine/bridge-theo')

const filePath = resolve(__dirname, 'colors.yml')
const titleize = string => string.replace(/^color/, '').replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase())
const variablize = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
const modify = prop => {
  const { name, reference } = prop
  prop.name = titleize(name)
  prop.variable = variablize(name)
  if (reference) prop.reference = titleize(reference)
  return prop
}

module.exports = convert(filePath, modify)
```
