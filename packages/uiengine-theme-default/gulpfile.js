const gulp = require('gulp')
const mergeStream = require('merge-stream')
const runSequence = require('run-sequence')
const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const csswring = require('csswring')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const p = require('gulp-load-plugins')()

const looks = ['default', 'uiengineering']

const paths = {
  stylesLib: './src/styles/lib',
  dist: './static/_uiengine-theme',
  lib: './lib'
}

const src = {
  lib: ['./src/*.js'],
  pug: ['./src/**/*.pug'],
  icons: ['./src/icons/**/*.svg'],
  svgs: ['./src/svgs/**/*.svg'],
  styles: ['./src/styles/*.styl', './src/components/**/*.styl'],
  hljs: ['./node_modules/highlight.js/styles/**'],
  scripts: ['src/scripts/*.js', './src/components/**/*.js'],
  static: ['./src/{fonts,images}/**'],
  rev: [paths.dist + '/**/*.{css,js,map,ico,cur,svg,jpg,jpeg,png,gif,woff,woff2}']
}

const dist = (folder = '') => gulp.dest(`${paths.dist}/${folder}`)

const styles = look =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: [paths.stylesLib],
      import: ['variables', 'mediaQueries', 'mixins', `looks/${look}`],
      url: { name: 'embedurl' }
    }))
    .pipe(p.concat(`uiengine-${look}.css`))
    .pipe(p.postcss([
      mqpacker,
      autoprefixer({ browsers: ['last 2 versions'] }),
      csswring
    ]))
    .pipe(dist('styles'))

gulp.task('styles', () => mergeStream(...looks.map(styles)))

gulp.task('hljs', () =>
  gulp.src(src.hljs)
    .pipe(dist('styles/hljs'))
)

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
    .pipe(dist())
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
                { removeUselessStrokeAndFill: true },
                { removeAttrs: { attrs: '(stroke|fill)' } }
              ]
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(`${paths.lib}/templates/includes`))
)

gulp.task('svgs', () =>
  gulp.src(src.svgs)
    .pipe(p.plumber())
    .pipe(p.svgo())
    .pipe(dist('svgs'))
)

gulp.task('scripts', () =>
  gulp.src('src/scripts/main.js')
    .pipe(p.plumber())
    .pipe(webpackStream({}, webpack))
    .pipe(p.concat('uiengine.js'))
    .pipe(dist('scripts'))
)

gulp.task('scripts:preview', cb =>
  gulp.src('node_modules/iframe-resizer/js/iframeResizer.contentWindow.js')
    .pipe(p.plumber())
    .pipe(p.concat('uiengine-preview.js'))
    .pipe(p.uglify())
    .pipe(dist('scripts'))
)

gulp.task('rev', () => {
  const RevAll = p.revAll
  const revAll = new RevAll()
  return gulp.src(src.rev)
    .pipe(revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(dist())
    .pipe(revAll.manifestFile())
    .pipe(dist())
})

gulp.task('watch', cb => {
  gulp.watch(src.lib, ['lib'])
  gulp.watch(src.pug, ['pug'])
  gulp.watch(src.icons, ['icons'])
  gulp.watch(src.svgs, ['svgs'])
  gulp.watch(src.static, ['static'])
  gulp.watch(src.scripts, ['scripts'])
  gulp.watch(src.styles.concat([`${paths.stylesLib}/**/*.styl`]), ['styles'])
})

gulp.task('generate', ['lib', 'pug', 'scripts', 'scripts:preview', 'icons', 'svgs', 'styles', 'static', 'hljs'])
gulp.task('build', cb => runSequence('generate', 'rev', cb))
gulp.task('develop', (cb) => runSequence('generate', 'watch', cb))
