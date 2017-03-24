# Integrations

## Gulp

To integrate the UIengine into your Gulp build you have to add the
following lines of code to your Gulpfile:

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
