const path = require('path')
const UIengine = require('../../uiengine')
const debounce = require('../../util/debounce')

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

const startWatcher = ({ source: { configFile, components, pages, templates }, adapters, theme, debug }, browserSync) => {
  const chokidar = requireOptional('chokidar', 'watch')

  // watch paths
  const baseDir = process.cwd()
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**') : null
  const themeGlob = debug ? path.join(baseDir, 'node_modules/uiengine-theme-default/{lib,static}', '**') : null
  const sourceFiles = [configFile, componentsGlob, templatesGlob, pagesGlob, themeGlob].filter(a => a)

  // const log = log.bind(console)
  const handleFileChange = (type, filePath) => debounce('reload', () => {
    UIengine.generateIncrementForFileChange(filePath, type)
      .then(change => console.log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`))
      .catch(error => console.log(`🚨  Error generating increment for changed file ${path.relative(baseDir, filePath)}:`, error))
  })

  // source
  chokidar.watch(sourceFiles, watchOptions)
    .on('add', filePath => handleFileChange('added', filePath))
    .on('addDir', filePath => handleFileChange('added', filePath))
    .on('change', filePath => handleFileChange('changed', filePath))
    .on('unlink', filePath => handleFileChange('deleted', filePath))
    .on('unlinkDir', filePath => handleFileChange('deleted', filePath))

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
