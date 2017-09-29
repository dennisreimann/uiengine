# Integrations

## Gulp

To integrate the UIengine into your Gulp build you have to add the following lines of code to your Gulpfile:

```js
// import gulp
import gulp from 'gulp'

// import the UIengine gulp integration
import { integrations as UIintegrations } from 'uiengine'

// initialize the UIengine gulp integration with the gulp instance
const uiGulp = UIintegrations.gulp(gulp)

// create a task that generates the site
uiGulp.task('uiengine-generate')

// in your regular gulp watch …
gulp.task('watch', () => {
  // create a watcher for file changes
  uiGulp.watch()
})
```

The `uiGulp.watch()` function generates a `gulp.watch()` for the files and folders referenced in your [project configuration](./config.md).
It performs the neccessary actions to rebuild the site as efficiently as possible.

In case your project has additional files that should trigger a rebuild you can pass them as a `String` or `Array`, like with `gulp.watch`:

```js
gulp.task('watch', () => {
  // create a watcher for file changes and pass
  // additional files that should trigger a rebuild
  uiGulp.watch(['src/data/*.json', 'src/custom/**/*.md'])
})
```

## Theo

You can integrate and consume design tokens defined with the [Theo](https://github.com/salesforce-ux/theo#spec) tokens spec.

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
import path from 'path'
import theo from 'theo'
import { integrations as UIintegrations } from 'uiengine'

const filePath = path.resolve(__dirname, 'colors.yml')

module.exports = UIintegrations.theo(theo).convert(filePath)
```

The transformations converts your Theo `props` into a format that can be rendered by the UIengine tokens template.
For details on the format see the [design token docs](./design-tokens.md).

You can also pass a modification callback to the `convert` function.
This allows you to further modify the property data:


```js
import path from 'path'
import theo from 'theo'
import { integrations as UIintegrations } from 'uiengine'

const filePath = path.resolve(__dirname, 'colors.yml')
const titleize = string => string.replace(/^color/, '').replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase())
const kebabCase = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
const modify = prop => {
  const { name } = prop
  prop.name = titleize(name)
  prop.variable = kebabCase(name)
  return prop
}

module.exports = UIintegrations.theo(theo).convert(filePath, modify)
```
