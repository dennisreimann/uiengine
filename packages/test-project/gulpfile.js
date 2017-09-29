const gulp = require('gulp')
const runSequence = require('run-sequence')
const bsConfig = require('./bs-config')
const browserSync = require('browser-sync').create()
const UIengine = require('uiengine')

const uiGulp = UIengine.integrations.gulp(gulp, { debug: 1 })

uiGulp.task('site')
gulp.task('browserSync', cb => browserSync.init(bsConfig))
gulp.task('watch', cb => uiGulp.watch(['./src/tokens/*.yml']))
gulp.task('build', cb => runSequence(['site'], cb))
gulp.task('develop', cb => runSequence('build', ['watch', 'browserSync'], cb))
