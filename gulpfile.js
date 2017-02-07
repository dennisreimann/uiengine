const gulp = require('gulp')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const BrowserSync = require('browser-sync')
const UIengine = require('.')
const p = require('gulp-load-plugins')()

const browserSync = BrowserSync.create()

const debounceTimer = {}
const debounce = (key, fn, delay) => {
  clearTimeout(debounceTimer[key])
  debounceTimer[key] = setTimeout(fn, delay)
}

const paths = {
  config: './sample_project/uiengine.yml',
  site: './sample_project/dist',
  stylesLib: './theme/styles/lib',
  theme: './theme'
}

const src = {
  templates: ['./theme/templates/**/*.pug'],
  styles: ['./theme/styles/*.styl'],
  scripts: ['theme/scripts/*.js'],
  static: ['./theme/static/**'],
  rev: ['./theme/assets/**/*.{css,js,map,ico,cur,svg,jpg,jpeg,png,gif,woff,woff2}'],
  site: ['./sample_project/src/{components,pages}/**/*']
}

const uieOpts = {
  config: paths.config,
  debug: true
}

gulp.task('static', () =>
  gulp.src(src.static)
    .pipe(gulp.dest(`${paths.theme}/assets`))
    .pipe(gulp.dest(`${paths.site}/assets`))
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
    .pipe(gulp.dest(`${paths.site}/assets/styles`))
    .pipe(browserSync.stream({ match: '**/*.css' }))
)

gulp.task('scripts', () =>
  gulp.src(src.scripts)
    .pipe(p.plumber())
    .pipe(p.babel())
    .pipe(p.concat('uiengine.js'))
    .pipe(p.uglify())
    .pipe(gulp.dest(`${paths.theme}/assets/scripts`))
    .pipe(gulp.dest(`${paths.site}/assets/scripts`))
    .pipe(browserSync.stream({ match: '**/*.js' }))
)

gulp.task('rev', () => {
  const RevAll = p.revAll
  const revAll = new RevAll()
  return gulp.src(src.rev)
    .pipe(revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(`${paths.theme}/assets`))
    .pipe(gulp.dest(`${paths.site}/assets`))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(`${paths.theme}/assets`))
    .pipe(gulp.dest(`${paths.site}/assets`))
})

gulp.task('site', (cb) => {
  UIengine.generate(uieOpts)
    .then(() => cb())
    .catch(error => p.util.log('Error generating site:', error))
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
  gulp.watch(src.static, ['static'])
  gulp.watch(src.templates, ['site'])
  gulp.watch(src.scripts, ['scripts'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/*.styl`]), ['styles'])
  gulp.watch(src.site).on('change', (file) =>
    UIengine.generateIncrementForChangedFile(uieOpts, file.path)
      .then(change => p.util.log('Rebuilt', change.type, change.item, '(triggered by', change.file, ')'))
      .catch(error => p.util.log('Error generating increment for changed file', file.path, ':', error))
  )
  // use debounce to prevent reloading for every file change
  gulp.watch(`${paths.site}/**/*.html`).on('change', () => debounce('reload', browserSync.reload, 500))
})

gulp.task('build', (cb) => runSequence(['scripts', 'styles', 'static'], 'site', cb))

gulp.task('develop', (cb) => runSequence('build', ['watch', 'browserSync'], cb))

gulp.task('production', cb => runSequence('build', 'rev', cb))
