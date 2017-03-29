const Common = require('../../integrations/common')
const UIengine = require('../../uiengine')

exports.describe = 'Generate the site'

exports.builder = argv =>
  argv
    .example('$0 generate')
    // watch
    .boolean('watch')
    .default('watch', false)
    .describe('watch', 'Rebuild on modification')
    .alias('w', 'watch')
    // server
    .boolean('serve')
    .default('serve', false)
    .describe('serve', 'Spawn a server')
    .alias('s', 'serve')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }

  console.log(`🚧  Generating …\n`)

  UIengine.generate(opts)
    .then(({ config }) => {
      console.log(`✅  ${config.name} generated!\n`)

      const browserSync = argv.serve ? startServer(config, argv.watch) : null
      if (argv.watch) startWatcher(config, browserSync)
    })
    .catch((err) => {
      console.error([`🚨  generating the site failed!`, err.stack].join('\n\n') + '\n')
      process.exit(1)
    })
}

const requireOptional = (module, option) => {
  try {
    return require(module)
  } catch (err) {
    console.error(`The optional dependency ${module} failed to install and is required for --${option}.\nIt is likely not supported on your platform.`)
    throw err
  }
}

const watchOptions = {
  ignoreInitial: true,
  awaitWriteFinish: {
    pollInterval: 50,
    stabilityThreshold: 50
  }
}

const startWatcher = (config, browserSync) => {
  const chokidar = requireOptional('chokidar', 'watch')
  const handle = Common.handleFileChange
  const sourceFiles = Common.sourceFilesFromConfig(config)

  // source
  chokidar.watch(sourceFiles, watchOptions)
    .on('add', filePath => handle(filePath, 'added'))
    .on('addDir', filePath => handle(filePath, 'added'))
    .on('change', filePath => handle(filePath, 'changed'))
    .on('unlink', filePath => handle(filePath, 'deleted'))
    .on('unlinkDir', filePath => handle(filePath, 'deleted'))

  console.log(`🔁  Watching for file changes …\n`)
}

const startServer = ({ target, browserSync }, watch) => {
  const server = requireOptional('browser-sync', 'serve').create()
  const options = browserSync || { server: { baseDir: target }, notify: false }

  if (watch) {
    options.files = options.files || options.server.baseDir
    options.watchOptions = options.watchOptions || watchOptions
    options.reloadDebounce = typeof options.reloadDebounce !== 'undefined' ? options.reloadDebounce : 125
    options.reloadThrottle = typeof options.reloadThrottle !== 'undefined' ? options.reloadThrottle : 125
  }

  server.init(options)

  return server
}
