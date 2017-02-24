const gulp = require('gulp')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const p = require('gulp-load-plugins')()

const paths = {
  stylesLib: './src/styles/lib',
  dist: './static/_uiengine-theme',
  lib: './lib'
}

const src = {
  lib: ['./src/*.js'],
  pug: ['./src/**/*.pug'],
  styles: ['./src/styles/*.styl', './src/components/**/*.styl'],
  scripts: ['src/scripts/*.js', './src/components/**/*.js'],
  static: ['./src/{fonts,images,svgs}/**'],
  rev: [paths.dist + '/**/*.{css,js,map,ico,cur,svg,jpg,jpeg,png,gif,woff,woff2}']
}

gulp.task('lib', () =>
  gulp.src(src.lib)
    .pipe(p.plumber())
    .pipe(p.babel())
    .pipe(gulp.dest(paths.lib))
)

gulp.task('pug', () =>
  gulp.src(src.pug)
    .pipe(gulp.dest(paths.lib))
)

gulp.task('static', () =>
  gulp.src(src.static)
    .pipe(gulp.dest(paths.dist))
)

gulp.task('styles', cb =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: [paths.stylesLib],
      import: ['variables', 'mediaQueries', 'extends']
    }))
    .pipe(p.concat('uiengine.css'))
    .pipe(p.postcss([
      mqpacker,
      autoprefixer({ browsers: ['last 2 versions'] }),
      csswring
    ]))
    .pipe(gulp.dest(`${paths.dist}/styles`))
)

gulp.task('scripts', () =>
  gulp.src('src/scripts/main.js')
    .pipe(p.plumber())
    .pipe(webpackStream({}, webpack))
    .pipe(p.concat('uiengine.js'))
    .pipe(gulp.dest(`${paths.dist}/scripts`))
)

gulp.task('scripts:preview', cb =>
  gulp.src('node_modules/iframe-resizer/js/iframeResizer.contentWindow.js')
    .pipe(p.plumber())
    .pipe(p.concat('uiengine-preview.js'))
    .pipe(p.uglify())
    .pipe(gulp.dest(`${paths.dist}/scripts`))
)

gulp.task('rev', () => {
  const RevAll = p.revAll
  const revAll = new RevAll()
  return gulp.src(src.rev)
    .pipe(revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(paths.dist))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(paths.dist))
})

gulp.task('watch', cb => {
  gulp.watch(src.lib, ['lib'])
  gulp.watch(src.pug, ['pug'])
  gulp.watch(src.static, ['static'])
  gulp.watch(src.scripts, ['scripts'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/*.styl`]), ['styles'])
})

gulp.task('generate', ['lib', 'pug', 'scripts', 'scripts:preview', 'styles', 'static'])
gulp.task('build', cb => runSequence('generate', 'rev', cb))
gulp.task('develop', (cb) => runSequence('generate', 'watch', cb))
