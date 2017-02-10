const gulp = require('gulp')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const p = require('gulp-load-plugins')()

const paths = {
  stylesLib: './theme/styles/lib',
  theme: './theme'
}

const src = {
  templates: ['./theme/templates/**/*.pug'],
  styles: ['./theme/styles/*.styl'],
  scripts: ['theme/scripts/*.js'],
  static: ['./theme/static/**'],
  rev: ['./theme/assets/**/*.{css,js,map,ico,cur,svg,jpg,jpeg,png,gif,woff,woff2}']
}

gulp.task('static', () =>
  gulp.src(src.static)
    .pipe(gulp.dest(`${paths.theme}/assets`))
)

gulp.task('styles', cb =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: [paths.stylesLib],
      import: ['mediaQueries', 'variables']
    }))
    .pipe(p.concat('uiengine.css'))
    .pipe(p.postcss([
      mqpacker,
      autoprefixer({ browsers: ['last 2 versions'] }),
      csswring
    ]))
    .pipe(gulp.dest(`${paths.theme}/assets/styles`))
)

gulp.task('scripts', () =>
  gulp.src(src.scripts)
    .pipe(p.plumber())
    .pipe(p.babel())
    .pipe(p.concat('uiengine.js'))
    .pipe(p.uglify())
    .pipe(gulp.dest(`${paths.theme}/assets/scripts`))
)

gulp.task('rev', () => {
  const RevAll = p.revAll
  const revAll = new RevAll()
  return gulp.src(src.rev)
    .pipe(revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(`${paths.theme}/assets`))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(`${paths.theme}/assets`))
})

gulp.task('watch', cb => {
  gulp.watch(src.static, ['static'])
  gulp.watch(src.scripts, ['scripts'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/*.styl`]), ['styles'])
})

gulp.task('build', (cb) => runSequence(['scripts', 'styles', 'static'], cb))

gulp.task('develop', (cb) => runSequence('build', 'watch', cb))

gulp.task('production', cb => runSequence('build', 'rev', cb))
