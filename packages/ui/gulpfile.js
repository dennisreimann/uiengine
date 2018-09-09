const gulp = require('gulp')
const { dirname, join } = require('path')
const runSequence = require('run-sequence')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')

const webpackEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const webpackConfig = require(join(__dirname, `build/webpack.${webpackEnv}.conf.js`))

const src = {
  webpack: ['src/{scripts,styles,templates,vue}/**/*']
}

// TODO: Move this to npm script and eliminate gulp build
gulp.task('hljs', () =>
  gulp.src(`${dirname(require.resolve('highlight.js/styles/github.css'))}/**`)
    .pipe(gulp.dest('./static/styles/hljs'))
)

gulp.task('webpack', () =>
  gulp.src('src/scripts/main.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('./dist'))
)

gulp.task('watch', () => {
  gulp.watch(src.webpack, ['webpack'])
})

gulp.task('build', cb => runSequence(['hljs'], ['webpack'], cb))
gulp.task('develop', cb => runSequence('build', 'watch', cb))
