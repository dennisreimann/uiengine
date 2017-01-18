const gulp = require('gulp')
const runSequence = require('run-sequence')
const p = require('gulp-load-plugins')()

const src = {
  helpers: ['theme/helpers.js'],
  partials: ['theme/components/*/*.hbs'],
  templates: ['theme/templates/**/*.hbs']
}

const dest = {
  helpers: 'default-theme',
  partials: 'default-theme/partials',
  templates: 'default-theme/templates'
}

gulp.task('helpers', cb =>
  gulp.src(src.helpers)
    .pipe(gulp.dest(dest.helpers))
)

gulp.task('partials', cb =>
  gulp.src(src.partials)
    .pipe(p.rename((filePath) => { filePath.dirname = '' }))
    .pipe(gulp.dest(dest.partials))
)

gulp.task('templates', cb =>
  gulp.src(src.templates)
    .pipe(gulp.dest(dest.templates))
)

gulp.task('watch', cb => {
  gulp.watch(src.helpers, ['helpers'])
  gulp.watch(src.templates, ['templates'])
  gulp.watch(src.partials, ['partials'])
})

gulp.task('build', ['helpers', 'partials', 'templates'])

gulp.task('default', cb => runSequence('build', 'watch', cb))
