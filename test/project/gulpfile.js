const { join } = require('path')
const gulp = require('gulp')
const concat = require('gulp-concat')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const UIengine = require('@uiengine/core')

const src = {
  assets: ['./src/assets/**'],
  css: {
    components: [
      './src/styles/main.css',
      './src/{elements,modules}/*/*.css'
    ],
    themes: [
      './src/styles/themes/*.css',
      './src/{elements,modules}/*/themes/*.css'
    ],
    uiengine: [
      './src/styles/uiengine-custom-styles.css'
    ]
  }
}

const dist = {
  root: '../tmp',
  assets: '../tmp/assets'
}

const themes = ['plain', 'funky']

const isDev = process.env.NODE_ENV !== 'production'

const globToTheme = theme =>
  glob => glob.replace(/\*\.css$/, `${theme}.css`)

// run webpack as a task dependency, because its output
// is required for the vue adapter (see adapter options)
gulp.task('uiengine', ['webpack'], done => {
  const opts = {
    debug: isDev,
    serve: isDev,
    watch: isDev
  }

  UIengine.build(opts)
    .then(state => { done() })
    .catch(done)
})

gulp.task('assets', () =>
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets))
)

gulp.task('css:components', () =>
  gulp.src(src.css.components)
    .pipe(concat('components.css'))
    .pipe(gulp.dest(join(dist.assets, 'styles')))
)

gulp.task('css:uiengine', () =>
  gulp.src(src.css.uiengine)
    .pipe(gulp.dest(join(dist.assets, 'styles')))
)

themes.forEach(theme =>
  gulp.task(`css:theme:${theme}`, () => {
    const globs = src.css.themes.map(globToTheme(theme))
    return gulp.src(globs)
      .pipe(concat(`theme-${theme}.css`))
      .pipe(gulp.dest(join(dist.assets, 'styles')))
  })
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

gulp.task('css', ['css:components', 'css:uiengine'].concat(themes.map(theme => `css:theme:${theme}`)))
gulp.task('build', ['uiengine', 'css', 'assets'])
gulp.task('develop', ['build', 'watch'])

gulp.task('watch', () => {
  gulp.watch(src.assets, ['assets'])
  gulp.watch(src.css.uiengine, ['css:uiengine'])
  gulp.watch(src.css.components, ['css:components'])

  themes.forEach(theme =>
    gulp.watch(src.css.themes.map(globToTheme(theme)), [`css:theme:${theme}`])
  )
})
