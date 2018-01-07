const gulp = require('gulp')
const UIengine = require('uiengine')

const src = {
  assets: ['./src/assets/**/*'],
  tokens: ['./src/tokens/*.yml']
}

const dist = {
  assets: '../../test/tmp/assets'
}

const isDev = process.env.NODE_ENV !== 'production'

gulp.task('uiengine', done => {
  const opts = {
    serve: isDev,
    watch: isDev ? src.tokens : false
  }

  UIengine.build(opts)
    .then(() => { done() })
    .catch(err => { done(err) })
})

gulp.task('assets', () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets))
)

gulp.task('build', ['uiengine', 'assets'])
gulp.task('develop', ['build', 'watch'])
gulp.task('watch', () => {
  gulp.watch(src.assets, ['assets'])
})
