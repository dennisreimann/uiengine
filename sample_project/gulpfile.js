const gulp = require('gulp')
const runSequence = require('run-sequence')
const BrowserSync = require('browser-sync')
const UIengine = require('..')
const p = require('gulp-load-plugins')()

const browserSync = BrowserSync.create()

const debounceTimer = {}
const debounce = (key, fn, delay) => {
  clearTimeout(debounceTimer[key])
  debounceTimer[key] = setTimeout(fn, delay)
}

const paths = {
  config: './uiengine.yml',
  site: './dist'
}

const src = {
  site: ['./src/{components,pages}/**/*', './theme/{assets,templates}/**/*']
}

const uieOpts = {
  config: paths.config,
  debug: true
}

gulp.task('site', (cb) => {
  UIengine.generate(uieOpts)
    .then(() => cb())
    .catch(error => p.util.log('Error generating site:', error, error.stack))
})

gulp.task('browserSync', () =>
  browserSync.init({
    open: false,
    server: {
      baseDir: paths.site
    }
  })
)

gulp.task('watch', cb => {
  gulp.watch(src.site).on('change', (file) =>
    UIengine.generateIncrementForChangedFile(uieOpts, file.path)
      .then(change => p.util.log('Rebuilt', change.type, change.item, '(triggered by', change.file, ')'))
      .catch(error => p.util.log('Error generating increment for changed file', file.path, ':', error))
  )
  // use debounce to prevent reloading for every file change
  gulp.watch(`${paths.site}/**/*.html`).on('change', () => debounce('reload', browserSync.reload, 500))
})

gulp.task('build', (cb) => runSequence(['site'], cb))

gulp.task('develop', (cb) => runSequence('build', ['watch', 'browserSync'], cb))
