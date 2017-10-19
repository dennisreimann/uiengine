const gulp = require('gulp')
const runSequence = require('run-sequence')
const bsConfig = require('./bs-config')
const browserSync = require('browser-sync').create()
const UIengine = require('uiengine')

const uiGulp = UIengine.integrations.gulp(gulp, { debug: 1 })

const src = {
  assets: ['./src/assets/**/*'],
  tokens: ['./src/tokens/*.yml']
}

const dist = {
  assets: '../../test/tmp/assets'
}

uiGulp.task('site')

gulp.task('assets', () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets))
)

gulp.task('browserSync', cb => browserSync.init(bsConfig))
gulp.task('build', cb => runSequence(['site', 'assets'], cb))
gulp.task('develop', cb => runSequence('build', ['watch', 'browserSync'], cb))
gulp.task('watch', cb => {
  uiGulp.watch(src.tokens)
  gulp.watch(src.assets, ['assets'])
})
