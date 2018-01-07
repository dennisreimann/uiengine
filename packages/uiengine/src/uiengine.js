const path = require('path')
const Core = require('./core')
const debounce = require('./util/debounce')
const { debug3 } = require('./util/debug')

export const CONFIG_FILENAME = 'uiengine.yml'

const sourceFilesFromConfig = ({ source: { configFile, components, data, schema, pages, templates }, adapters, debug, theme }) => {
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**') : null
  const dataGlob = data ? path.join(data, '**') : null
  const schemaGlob = data ? path.join(schema, '**/*.yml') : null
  const sourceFiles = [configFile, componentsGlob, dataGlob, schemaGlob, pagesGlob, templatesGlob].filter(a => a)

  if (debug) {
    const themeLibGlob = path.join(path.dirname(require.resolve(theme.module)), '**')
    const themeStaticGlob = path.join(require(theme.module).staticPath, '**')
    sourceFiles.push(themeLibGlob, themeStaticGlob)
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
  reloadThrottle: 500,
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
          console.error(`🚨  Rebuild for changed file ${path.relative(process.cwd(), filePath)} failed:`, error)
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
  const server = requireOptional('browser-sync', 'serve').create()
  const historyApiFallback = require('connect-history-api-fallback', 'serve')
  const defaults = {
    server: {
      baseDir: target
    },
    // TODO: Add html injection
    // https://github.com/Browsersync/recipes/tree/master/recipes/html.injection
    middleware: [],
    files: [
      '_pages/**/*',
      '_variants/**/*',
      '_uiengine-theme/**/*'
    ]
  }
  const options = browserSync || defaults

  options.server = options.server || defaults.server
  options.server.baseDir = options.server.baseDir || defaults.server.baseDir
  options.middleware = options.middleware || defaults.middleware
  options.middleware.push(historyApiFallback())

  if (watch) {
    options.files = options.files || defaults.files
    options.watchOptions = options.watchOptions || browserSyncOptions.watchOptions
    options.notify = typeof options.notify !== 'undefined' ? options.notify : browserSyncOptions.notify
    options.reloadThrottle = typeof options.reloadThrottle !== 'undefined' ? options.reloadThrottle : browserSyncOptions.reloadThrottle
  }

  debug3(state, 'BrowserSync options:', JSON.stringify(options, null, 2))

  server.init(options)

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
