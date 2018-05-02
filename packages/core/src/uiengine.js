const { dirname, join, relative } = require('path')
const Core = require('./core')
const { debounce } = require('./util/debounce')
const { debug3 } = require('./util/debug')

const globPattern = '**/*'

const sourceFilesFromConfig = ({ source: { configFile, components, data, entities, pages, templates }, adapters, debug, ui }) => {
  const componentsGlob = components ? join(components, globPattern) : null
  const templatesGlob = templates ? join(templates, globPattern) : null
  const pagesGlob = pages ? join(pages, globPattern) : null
  const dataGlob = data ? join(data, globPattern) : null
  const entitiesGlob = entities ? join(entities, globPattern) : null
  const sourceFiles = [configFile, componentsGlob, dataGlob, entitiesGlob, pagesGlob, templatesGlob].filter(a => a)

  if (debug) {
    const uiLibGlob = join(dirname(require.resolve('@uiengine/ui')), globPattern)
    const uiDistGlob = uiLibGlob.replace('ui/lib/', 'ui/dist/')
    sourceFiles.push(uiLibGlob, uiDistGlob)
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

const optionWithDefault = (def, value) =>
  typeof value !== 'undefined' ? value : def

const requireOptional = (module, option) => {
  try {
    return require(module)
  } catch (err) {
    console.error(`The optional dependency ${module} failed to install and is required for --${option}.`, 'It is likely not supported on your platform.')

    throw err
  }
}

const startWatcher = (state, opts, server) => {
  const { config } = state
  const { watch, info } = opts
  const chokidar = requireOptional('chokidar', 'watch')
  const sourceFiles = sourceFilesFromConfig(config)

  let additionalFiles = []
  if (typeof watch === 'string') {
    additionalFiles = [watch]
  } else if (Array.isArray(watch)) {
    additionalFiles = watch
  }

  const handleFileChange = (filePath, type) => {
    return debounce('handleFileChange', async () => {
      if (Core.isGenerating()) return

      try {
        const { state, change } = await Core.generateIncrementForFileChange(filePath, type)

        if (info) console.info(`✨  Rebuilt ${change.type} ${change.item}`, `(${change.action} ${change.file})`)
        if (server) server.sockets.emit('uiengine:state:update', state)
      } catch (err) {
        console.error(`🚨  Rebuild for changed file ${relative(process.cwd(), filePath)} failed:`, err)
      }
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

const startServer = (state, opts) => {
  const { browserSync, target, ui } = state.config
  const { watch, info } = opts
  const server = requireOptional('browser-sync', 'serve').create('UIengine')
  const history = requireOptional('connect-history-api-fallback')
  const pagesPattern = '_pages/**/*'
  const variantsPattern = '_variants/**/*'
  const defaults = {
    server: {
      baseDir: target
    },
    files: [
      {
        match: [globPattern],
        options: {
          cwd: target,
          ignored: [
            // exclude files with state as they change on every rebuild.
            // changes are injected via websockets (see handleFileChange)
            'index.html',
            '_sketch.html',
            '_state.json',
            // exclude pages and variants as the iframes are reloaded
            // separately (see server.init callback)
            pagesPattern,
            variantsPattern
          ]
        }
      }
    ],
    middleware: []
  }
  const options = optionWithDefault(defaults, browserSync)

  options.server = optionWithDefault(defaults.server, options.server)
  options.server.baseDir = optionWithDefault(defaults.server.baseDir, options.server.baseDir)
  options.middleware = optionWithDefault(defaults.middleware, options.middleware)
  options.logLevel = optionWithDefault((info ? 'info' : 'silent'), options.logLevel)

  const basePath = (optionWithDefault('/', ui.base)).replace(/\/$/, '')
  options.middleware.push({
    route: basePath,
    handle: history()
  })

  if (watch) {
    options.files = optionWithDefault(defaults.files, options.files)
    options.watchOptions = optionWithDefault(browserSyncOptions.watchOptions, options.watchOptions)
    options.notify = optionWithDefault(browserSyncOptions.notify, options.notify)
  }

  debug3(state, 'BrowserSync options:', JSON.stringify(options, null, 2))

  server.init(options, (err, instance) => {
    if (err) console.error('Initializing server failed: ', err)

    const _paths = filePath => join(target, filePath)
    // trigger iframe reloads, see
    // https://github.com/BrowserSync/browser-sync/issues/662#issuecomment-110478137
    server.watch([
      _paths(pagesPattern),
      _paths(variantsPattern)
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
  options.info = optionWithDefault(true, options.info)
  options.serve = optionWithDefault(false, options.serve)
  options.watch = optionWithDefault(false, options.watch)

  if (options.info) console.info('🚧  Building …')

  try {
    const state = await Core.generate(options)

    if (options.info) console.info('✅  Build done!')

    let server, watcher
    if (options.serve) server = startServer(state, options)
    if (options.watch) watcher = startWatcher(state, options, server)

    return { state, server, watcher }
  } catch (err) {
    console.error(['🚨  Build failed!', err.stack].join('\n\n'))

    throw err
  }
}
