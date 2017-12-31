const gulp = require('gulp')
const path = require('path')
const mergeStream = require('merge-stream')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const p = require('gulp-load-plugins')()

const skins = ['default', 'deeplake', 'uiengineering']
const webpackEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const webpackConfig = require(path.join(__dirname, `build/webpack.${webpackEnv}.conf.js`))

const paths = {
  stylesLib: './src/styles/lib'
}

const src = {
  lib: ['./src/*.js', './src/{__,lib}/**/*.js'], // FIXME: '__' is a hack that allows for lib to be accepted as dynamic path component
  styles: ['./src/styles/*.styl', './src/components/**/*.styl'],
  webpack: ['src/{templates,vue}/**/*']
}

gulp.task('lib', () =>
  gulp.src(src.lib)
    .pipe(p.plumber())
    .pipe(p.babel())
    .pipe(gulp.dest('./lib'))
)

const styles = skin =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: [paths.stylesLib],
      import: ['variables', 'mediaQueries', 'mixins', `skins/${skin}`],
      url: { name: 'embedurl' }
    }))
    .pipe(p.concat(`uiengine-${skin}.css`))
    .pipe(p.postcss([
      mqpacker,
      autoprefixer({ browsers: ['last 2 versions'] }),
      csswring
    ]))
    .pipe(gulp.dest('./static/styles'))

gulp.task('styles', () => mergeStream(...skins.map(styles)))

gulp.task('hljs', () =>
  gulp.src(`${path.dirname(require.resolve('highlight.js/styles/github.css'))}/**`)
    .pipe(gulp.dest('./static/styles/hljs'))
)

gulp.task('webpack', () =>
  gulp.src('src/scripts/main.js')
    .pipe(p.plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('./dist'))
)

gulp.task('watch', cb => {
  gulp.watch(src.lib, ['lib'])
  gulp.watch(src.webpack, ['webpack'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/**/*.styl`]), ['styles'])
})

gulp.task('build', cb => runSequence(['lib', 'styles', 'hljs'], ['webpack'], cb))
gulp.task('develop', cb => runSequence('build', 'watch', cb))
