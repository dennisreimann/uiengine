const { dirname, join, relative } = require('path')
const Core = require('./core')
const {
  DebugUtil: { debug3 },
  MessageUtil: { reportSuccess, reportInfo, reportError }
} = require('@uiengine/util')

const globPattern = join('**', '*')

const sourceFilesFromConfig = ({ source: { configFile, components, data, entities, pages, templates }, adapters, debug, ui }) => {
  const componentsGlob = components ? join(components, globPattern) : null
  const templatesGlob = templates ? join(templates, globPattern) : null
  const pagesGlob = pages ? join(pages, globPattern) : null
  const dataGlob = data ? join(data, globPattern) : null
  const entitiesGlob = entities ? join(entities, globPattern) : null
  const sourceFiles = [configFile, componentsGlob, dataGlob, entitiesGlob, pagesGlob, templatesGlob].filter(a => a)

  if (debug) {
    const uiLibGlob = join(dirname(require.resolve('@uiengine/ui')), globPattern)
    const uiDistGlob = uiLibGlob.replace(join('ui', 'lib'), join('ui', 'dist'))
    sourceFiles.push(uiLibGlob, uiDistGlob)
  }

  return sourceFiles
}

// see https://github.com/paulmillr/chokidar#api
const watchOptions = {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 50
  }
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
    reportError('Missing dependency', new Error(`The optional dependency ${module} failed to install and is required for --${option}. It is likely not supported on your platform.`))

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

  const timers = {}
  const debounce = (key, fn, delay = 250) => {
    clearTimeout(timers[key])
    timers[key] = setTimeout(fn, delay)
  }

  const handleFileChange = (filePath, type) => {
    return debounce('handleFileChange', async () => {
      if (Core.isGenerating()) return

      try {
        if (info) reportInfo('Rebuiling …', { icon: '🚧', transient: true })

        const { state, change } = await Core.generateIncrementForFileChange(filePath, type)

        if (info) reportInfo(`Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`, { icon: '✨', transient: false })
        if (server) server.sockets.emit('uiengine:state:update', state)
      } catch (err) {
        reportError(`Rebuild for changed file ${relative(process.cwd(), filePath)} failed:`, err)
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
  const pagesPattern = join('_pages', '**', '*')
  const tokensPattern = join('_tokens', '**', '*')
  const variantsPattern = join('_variants', '**', '*')
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
            // exclude pages, tokens and variants as the iframes are
            // reloaded separately (see server.init callback)
            pagesPattern,
            tokensPattern,
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
  options.startPath = optionWithDefault(ui.base, options.startPath)

  const basePath = (optionWithDefault('/', ui.base)).replace(/\/$/, '')
  options.middleware.push({
    route: basePath,
    handle: history()
  })

  options.snippetOptions = {
    rule: {
      fn: function (snippet, match) {
        // browser-sync: append this script to reload pages on change in development.
        // we solve this via a manual socket connection to prevent reloading the
        // whole iframe host in case just the iframe content changes.
        // as the browser-sync client scripts loads asynchronously, we may need to
        // retrigger this function a few times.
        return match + `\n<!-- UIengine: inject start -->\n${snippet}\n<script>
        let retries = 0;
        const setupSocket = () => {
          const { socket } = window.___browserSync___ || {};
          if (socket) {
            socket.on('uiengine:file:change', filePath => {
              if (window.location.pathname.endsWith(filePath)) {
                window.location.reload();
                console.debug('[UIengine]', 'Reload on file change', filePath);
              }
            })
            console.debug('[UIengine]', 'Connection to browser-sync socket established.');
          } else if (retries <= 10) {
            setTimeout(setupSocket, 100);
            retries++;
          } else {
            console.warn('[UIengine]', 'Could not connect to browser-sync socket.');
          }
        }
        setupSocket();
        </script>\n<!-- UIengine: inject end -->`
      }
    }
  }

  if (watch) {
    options.files = optionWithDefault(defaults.files, options.files)
    options.watchOptions = optionWithDefault(browserSyncOptions.watchOptions, options.watchOptions)
    options.notify = optionWithDefault(browserSyncOptions.notify, options.notify)
  }

  debug3(state, 'BrowserSync options:', JSON.stringify(options, null, 2))

  server.init(options, (err, instance) => {
    if (err) reportError('Initializing server failed:', err)

    const _paths = filePath => join(target, filePath)
    // trigger iframe reloads, see
    // https://github.com/BrowserSync/browser-sync/issues/662#issuecomment-110478137
    server.watch([
      _paths(pagesPattern),
      _paths(tokensPattern),
      _paths(variantsPattern)
    ]).on('change', filePath => {
      const file = relative(target, filePath)

      instance.io.sockets.emit('uiengine:file:change', file)
    })
  })

  return server
}

const theo = (theo, options = {}) =>
  require('./integrations/theo')(theo, options)

async function build (options = {}) {
  options.info = optionWithDefault(true, options.info)
  options.serve = optionWithDefault(false, options.serve)
  options.watch = optionWithDefault(false, options.watch)

  if (options.info) reportInfo('Building …', { icon: '🚧', transient: true })

  try {
    const state = await Core.generate(options)

    if (options.info) reportSuccess('Build done!')

    let server, watcher
    if (options.serve) server = startServer(state, options)
    if (options.watch) watcher = startWatcher(state, options, server)

    return { state, server, watcher }
  } catch (err) {
    reportError('Build failed!', err)

    throw err
  }
}

module.exports = {
  theo,
  build
}
