const gulp = require('gulp')
const mergeStream = require('merge-stream')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const p = require('gulp-load-plugins')()

const skins = ['default', 'deeplake', 'uiengineering']

const paths = {
  stylesLib: './src/styles/lib',
  theme: './static/_uiengine-theme',
  lib: './lib'
}

const src = {
  lib: ['./src/*.js'],
  pug: ['./src/components/*/*.pug'],
  icons: ['./src/icons/sprite/**/*.svg'],
  styles: ['./src/styles/*.styl', './src/components/**/*.styl'],
  hljs: ['./node_modules/highlight.js/styles/**'],
  scripts: ['src/scripts/**/*.js', './src/components/**/*.js'],
  static: ['./src/{fonts,images}/**'],
  locales: ['./src/locales/*.yml'],
  rev: [paths.theme + '/**/*.{css,js,map,ico,cur,svg,jpg,jpeg,png,gif,woff,woff2}']
}

const lib = (folder = '') => gulp.dest(`${paths.lib}/${folder}`)
const theme = (folder = '') => gulp.dest(`${paths.theme}/${folder}`)

gulp.task('lib', () =>
  gulp.src(src.lib)
    .pipe(p.plumber())
    .pipe(p.babel())
    .pipe(lib())
)

gulp.task('pug', () =>
  gulp.src(src.pug)
    .pipe(lib('components'))
)

gulp.task('static', () =>
  gulp.src(src.static)
    .pipe(theme())
)

gulp.task('icons', () =>
  gulp.src(src.icons)
    .pipe(p.plumber())
    .pipe(p.svgSprite({
      mode: {
        symbol: {
          dest: '',
          sprite: 'icons.svg',
          inline: true
        }
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                { removeTitle: true },
                { removeStyleElement: true },
                { removeUselessStrokeAndFill: true },
                { removeAttrs: { attrs: '(stroke|fill)' } }
              ]
            }
          }
        ]
      }
    }))
    .pipe(lib('components/layout'))
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
    .pipe(theme('styles'))

gulp.task('styles', () => mergeStream(...skins.map(styles)))

gulp.task('locales', () =>
  gulp.src(src.locales)
    .pipe(p.yaml())
    .pipe(theme('locales'))
)

gulp.task('hljs', () =>
  gulp.src(src.hljs)
    .pipe(theme('styles/hljs'))
)

gulp.task('scripts', () =>
  gulp.src('src/scripts/main.js')
    .pipe(p.plumber())
    .pipe(webpackStream({}, webpack))
    .pipe(p.concat('uiengine.js'))
    .pipe(theme('scripts'))
)

gulp.task('scripts:preview', cb =>
  gulp.src('node_modules/iframe-resizer/js/iframeResizer.contentWindow.js')
    .pipe(p.plumber())
    .pipe(p.concat('uiengine-preview.js'))
    .pipe(p.uglify())
    .pipe(theme('scripts'))
)

gulp.task('rev', () => {
  const RevAll = p.revAll
  const revAll = new RevAll()
  return gulp.src(src.rev)
    .pipe(revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(theme())
    .pipe(revAll.manifestFile())
    .pipe(theme())
})

gulp.task('watch', cb => {
  gulp.watch(src.lib, ['lib'])
  gulp.watch(src.pug, ['pug'])
  gulp.watch(src.icons, ['icons'])
  gulp.watch(src.static, ['static'])
  gulp.watch(src.scripts, ['scripts'])
  gulp.watch(src.locales, ['locales'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/**/*.styl`]), ['styles'])
})

gulp.task('generate', ['lib', 'pug', 'scripts', 'scripts:preview', 'icons', 'styles', 'static', 'hljs', 'locales'])
gulp.task('build', cb => runSequence('generate', 'rev', cb))
gulp.task('develop', (cb) => runSequence('generate', 'watch', cb))
