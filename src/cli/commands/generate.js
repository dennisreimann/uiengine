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

      if (argv.serve) startServer(config, argv.watch)
      if (argv.watch) startWatcher(config)
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

const startWatcher = (config) => {
  const chokidar = requireOptional('chokidar', 'watch')
  const handle = Common.handleFileChange
  const sourceFiles = Common.sourceFilesFromConfig(config)

  // source
  chokidar.watch(sourceFiles, Common.watchOptions)
    .on('add', filePath => handle(filePath, 'added'))
    .on('addDir', filePath => handle(filePath, 'added'))
    .on('change', filePath => handle(filePath, 'changed'))
    .on('unlink', filePath => handle(filePath, 'deleted'))
    .on('unlinkDir', filePath => handle(filePath, 'deleted'))

  console.log(`🔁  Watching for file changes …\n`)
}

const startServer = ({ target, browserSync }, watch) => {
  const server = requireOptional('browser-sync', 'serve').create()
  const options = browserSync || { server: { baseDir: target } }

  if (watch) {
    options.files = options.files || options.server.baseDir
    options.watchOptions = options.watchOptions || Common.browserSyncOptions.watchOptions
    options.notify = typeof options.notify !== 'undefined' ? options.notify : Common.browserSyncOptions.notify
    options.reloadDebounce = typeof options.reloadDebounce !== 'undefined' ? options.reloadDebounce : Common.browserSyncOptions.reloadDebounce
    options.reloadThrottle = typeof options.reloadThrottle !== 'undefined' ? options.reloadThrottle : Common.browserSyncOptions.reloadThrottle
  }

  server.init(options)

  return server
}
