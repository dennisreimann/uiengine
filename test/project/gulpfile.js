const { join } = require('path')
const { src, dest, parallel, task, watch } = require('gulp')
const concat = require('gulp-concat')
const UIengine = require('@uiengine/core')

const srcs = {
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
  root: '../test-project',
  assets: '../test-project/assets'
}

const themes = ['plain', 'funky', '_all']

const isDev = process.env.NODE_ENV !== 'production'

const globToTheme = theme =>
  glob => glob.replace(/\*\.css$/, `${theme}.css`)

task('uiengine', done => {
  const opts = {
    debug: isDev,
    serve: isDev,
    watch: isDev
  }

  UIengine.build(opts)
    .then(() => { done() })
    .catch(done)
})

task('assets', () =>
  src(srcs.assets)
    .pipe(dest(dist.assets))
)

task('css:components', () =>
  src(srcs.css.components)
    .pipe(concat('components.css'))
    .pipe(dest(join(dist.assets, 'styles')))
)

task('css:uiengine', () =>
  src(srcs.css.uiengine)
    .pipe(dest(join(dist.assets, 'styles')))
)

themes.forEach(theme =>
  task(`css:theme:${theme}`, () => {
    const globs = srcs.css.themes.map(globToTheme(theme))
    return src(globs)
      .pipe(concat(`theme-${theme}.css`))
      .pipe(dest(join(dist.assets, 'styles')))
  })
)

task('incremental', () => {
  watch(srcs.assets, parallel('assets'))
  watch(srcs.css.uiengine, parallel('css:uiengine'))
  watch(srcs.css.components, parallel('css:components'))

  themes.forEach(theme =>
    watch(srcs.css.themes.map(globToTheme(theme)), parallel(`css:theme:${theme}`))
  )
})

task('css', parallel(['css:components', 'css:uiengine'].concat(themes.map(theme => `css:theme:${theme}`))))
task('build', parallel('uiengine', 'css', 'assets'))
task('develop', parallel('build', 'incremental'))
