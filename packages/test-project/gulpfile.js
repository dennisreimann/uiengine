const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const UIengine = require('uiengine')

const src = {
  assets: ['./src/assets/**/*'],
  tokens: ['./src/tokens/*.yml']
}

const dist = {
  root: '../../test/tmp',
  assets: '../../test/tmp/assets'
}

const isDev = process.env.NODE_ENV !== 'production'

// run webpack as a task dependency, because its output
// is required for the vue adapter (see adapter options)
gulp.task('uiengine', ['webpack'], done => {
  const opts = {
    serve: isDev,
    watch: isDev ? src.tokens.concat(['../uiengine-theme-default/dist/_uiengine-theme/**/*']) : false
  }

  UIengine.build(opts)
    .then(() => { done() })
    .catch(err => { done(err) })
})

gulp.task('assets', () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets))
)

const webpackBuild = env => {
  return () => {
    const webpackConfig = require(`./build/webpack.${env}.conf`)

    return gulp.src(webpackConfig.entry)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(dist.root))
  }
}

gulp.task('webpack-vue-server', webpackBuild('vue-server'))
gulp.task('webpack-vue-client', webpackBuild('vue-client'))
gulp.task('webpack', ['webpack-vue-server', 'webpack-vue-client'])

gulp.task('build', ['uiengine', 'assets'])
gulp.task('develop', ['build', 'watch'])

gulp.task('watch', () => {
  gulp.watch(src.assets, ['assets'])
})
