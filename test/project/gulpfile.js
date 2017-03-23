const gulp = require('gulp')
const runSequence = require('run-sequence')
const BrowserSync = require('browser-sync')
const UIengine = require('uiengine')
const p = require('gulp-load-plugins')()
const debounce = require('../../src/util/debounce')

const browserSync = BrowserSync.create()

const target = './dist'
const sources = [
  './uiengine.yml',
  './src/{components,pages,templates}/**/*.{md,hbs,jsx,pug}'
]

gulp.task('site', (cb) => {
  UIengine.generate()
    .then(() => cb())
    .catch(error => p.util.log('Error generating site:', error, error.stack))
})

gulp.task('browserSync', () =>
  browserSync.init({
    open: false,
    server: { baseDir: target }
  })
)

gulp.task('watch', cb => {
  gulp.watch(sources).on('change', (event) =>
    UIengine.generateIncrementForFileChange(event.path, event.type)
      .then(change => p.util.log('Rebuilt', change.type, change.item, '(triggered by', change.file, ')'))
      .catch(error => p.util.log('Error generating increment for changed file', event.path, ':', error))
  )
  // use debounce to prevent reloading for every file change
  gulp.watch(`${target}/**/*.html`).on('change', () => debounce('reload', browserSync.reload, 500))
})

gulp.task('build', (cb) => runSequence(['site'], cb))
gulp.task('develop', (cb) => runSequence('build', ['watch', 'browserSync'], cb))
