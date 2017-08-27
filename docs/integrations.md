# Integrations

## Gulp

To integrate the UIengine into your Gulp build you have to add the following lines of code to your Gulpfile:

```js
// import gulp
import gulp from 'gulp'

// import the UIengine gulp integration
import { gulp as UIgulp } from 'uiengine'

// initialize the UIengine gulp integration with the gulp instance
const uiGulp = UIgulp(gulp)

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
