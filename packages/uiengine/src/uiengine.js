const { dirname, join, relative } = require('path')
const Core = require('./core')
const debounce = require('./util/debounce')
const { debug3 } = require('./util/debug')

export const CONFIG_FILENAME = 'uiengine.yml'

const sourceFilesFromConfig = ({ source: { configFile, components, data, entities, pages, templates }, adapters, debug, theme }) => {
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? join(components, '**/*' + exts) : null
  const templatesGlob = templates ? join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? join(pages, '**') : null
  const dataGlob = data ? join(data, '**') : null
  const entitiesGlob = data ? join(entities, '**/*.yml') : null
  const sourceFiles = [configFile, componentsGlob, dataGlob, entitiesGlob, pagesGlob, templatesGlob].filter(a => a)

  if (debug) {
    const themeLibGlob = join(dirname(require.resolve(theme.module)), '**')
    sourceFiles.push(themeLibGlob)
  }

  return sourceFiles
}

// see https://github.com/paulmillr/chokidar#api
const watchOptions = {
  ignoreInitial: true,
  awaitWriteFinish: true
}

// see https://www.browsersync.io/docs/options/
const browserSyncOptions = {
  notify: false,
  single: true,
  watchOptions
}

const requireOptional = (module, option) => {
  try {
    return require(module)
  } catch (err) {
    console.error(`The optional dependency ${module} failed to install and is required for --${option}.\nIt is likely not supported on your platform.`)

    throw err
  }
}

const startWatcher = (state, watch, server) => {
  const { config } = state
  const chokidar = requireOptional('chokidar', 'watch')
  const sourceFiles = sourceFilesFromConfig(config)

  let additionalFiles = []
  if (typeof watch === 'string') {
    additionalFiles = [watch]
  } else if (Array.isArray(watch)) {
    additionalFiles = watch
  }

  const handleFileChange = (filePath, type) => {
    return debounce('handleFileChange', () => {
      if (Core.isGenerating()) return

      Core.generateIncrementForFileChange(filePath, type)
        .then(({ state, change }) => {
          console.log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`)

          if (server) {
            server.sockets.emit('uiengine:state:update', state)
          }
        })
        .catch(error => {
          console.error(`🚨  Rebuild for changed file ${relative(process.cwd(), filePath)} failed:`, error)
        })
    })
  }

  const watchFiles = sourceFiles.concat(additionalFiles)
  const watcher = chokidar.watch(watchFiles, watchOptions)
    .on('add', filePath => handleFileChange(filePath, 'added'))
    .on('addDir', filePath => handleFileChange(filePath, 'added'))
    .on('change', filePath => handleFileChange(filePath, 'changed'))
    .on('unlink', filePath => handleFileChange(filePath, 'deleted'))
    .on('unlinkDir', filePath => handleFileChange(filePath, 'deleted'))

  debug3(state, 'Watching files:', JSON.stringify(watchFiles, null, 2))

  return watcher
}

const startServer = (state, watch) => {
  const { target, browserSync } = state.config
  const server = requireOptional('browser-sync', 'serve').create('UIengine')
  const defaults = {
    server: {
      baseDir: target
    },
    files: [
      {
        match: ['**/*'],
        options: {
          cwd: target,
          ignored: [
            // exculde index.html as it changes on every rebuild and changes are injected via websockets (see handleFileChange)
            'index.html',
            // exclude pages and variants as the iframes are reloaded separately (see server.init callback)
            '_pages/**/*',
            '_variants/**/*'
          ]
        }
      }
    ]
  }
  const options = browserSync || defaults

  options.server = options.server || defaults.server
  options.server.baseDir = options.server.baseDir || defaults.server.baseDir

  if (watch) {
    options.files = options.files || defaults.files
    options.watchOptions = options.watchOptions || browserSyncOptions.watchOptions
    options.notify = typeof options.notify !== 'undefined' ? options.notify : browserSyncOptions.notify
    options.single = typeof options.single !== 'undefined' ? options.single : browserSyncOptions.single
  }

  debug3(state, 'BrowserSync options:', JSON.stringify(options, null, 2))

  server.init(options, (err, instance) => {
    if (err) console.error('Initializing server failed: ', err)

    const _paths = filePath => join(target, filePath)
    // trigger iframe reloads, see
    // https://github.com/BrowserSync/browser-sync/issues/662#issuecomment-110478137
    server.watch([
      _paths('_pages/**/*'),
      _paths('_variants/**/*')
    ]).on('change', filePath => {
      const file = relative(target, filePath)

      instance.io.sockets.emit('uiengine:file:change', file)
    })
  })

  return server
}

export const theo = (theo, options = {}) =>
  require('./integrations/theo')(theo, options)

export async function build (options = {}) {
  console.log('🚧  Building …')

  try {
    options.config = options.config || CONFIG_FILENAME

    const state = await Core.generate(options)

    console.log('✅  Build done!')

    let server, watcher
    if (options.serve) server = startServer(state, options.watch)
    if (options.watch) watcher = startWatcher(state, options.watch, server)

    return { state, server, watcher }
  } catch (err) {
    console.error(['🚨  Build failed!', err.stack].join('\n\n'))

    throw err
  }
}
