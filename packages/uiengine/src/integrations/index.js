const path = require('path')
const { debug3 } = require('../util/debug')

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

export const startWatcher = (state, watch, handleFileChange) => {
  const { config } = state
  const chokidar = requireOptional('chokidar', 'watch')
  const sourceFiles = sourceFilesFromConfig(config)

  let additionalFiles = []
  if (typeof watch === 'string') {
    additionalFiles = [watch]
  } else if (Array.isArray(watch)) {
    additionalFiles = watch
  }

  const watchFiles = sourceFiles.concat(additionalFiles)
  const watcher = chokidar.watch(watchFiles, watchOptions)
    .on('add', filePath => handleFileChange(filePath, 'added'))
    .on('addDir', filePath => handleFileChange(filePath, 'added'))
    .on('change', filePath => handleFileChange(filePath, 'changed'))
    .on('unlink', filePath => handleFileChange(filePath, 'deleted'))
    .on('unlinkDir', filePath => handleFileChange(filePath, 'deleted'))

  debug3(state, 'Watching files:', JSON.stringify(watchFiles, null, '  '))

  return watcher
}

export const startServer = (state, watch) => {
  const { target, browserSync } = state.config
  const browserSyncServer = requireOptional('browser-sync', 'serve').create()
  const historyApiFallback = require('connect-history-api-fallback', 'serve')
  const defaults = { server: { baseDir: target } }
  const options = browserSync || defaults

  options.server = options.server || defaults.server
  options.server.baseDir = options.server.baseDir || defaults.server.baseDir
  options.server.middleware = options.server.middleware || [ historyApiFallback() ]

  if (watch) {
    options.files = options.files || options.server.baseDir
    options.watchOptions = options.watchOptions || browserSyncOptions.watchOptions
    options.notify = typeof options.notify !== 'undefined' ? options.notify : browserSyncOptions.notify
    options.reloadThrottle = typeof options.reloadThrottle !== 'undefined' ? options.reloadThrottle : browserSyncOptions.reloadThrottle
  }

  debug3(state, 'BrowserSync options:', JSON.stringify(options, null, '  '))

  const server = browserSyncServer.init(options)

  return server
}

export const theo = (theo, options = {}) =>
  require('./theo')(theo, options)
