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

  UIengine.generate(opts)
    .then(({ config }) => {
      console.log(`✅  ${config.name} generated!`)

      const browserSync = argv.serve ? startServer(config) : null
      if (argv.watch) startWatcher(config, browserSync)
    })
    .catch((err) => {
      console.error([`🚨  generating the site failed!`, err.stack].join('\n\n'))
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

const startWatcher = ({ source: { config, components, pages, templates }, target, adapters }, browserSync) => {
  const chokidar = requireOptional('chokidar', 'watch')
  const watchOpts = {
    ignoreInitial: true,
    awaitWriteFinish: {
      pollInterval: 50,
      stabilityThreshold: 50
    }
  }

  // watch paths
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**/*') : null
  const targetGlob = target ? path.join(target, '**/*.html') : null
  const sourceFiles = [config, componentsGlob, templatesGlob, pagesGlob].filter(a => a)

  const log = console.log.bind(console)
  const debouncedReload = (type, filePath) => debounce('reload', browserSync.reload, 500)
  const handleFileChange = (type, filePath) => {
    UIengine.generateIncrementForFileChange(filePath, type)
      .then(change => log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`))
      .catch(error => log(`🚨  Error generating increment for changed file ${path.relative(__dirname, filePath)}:`, error))
  }

  // source
  chokidar.watch(sourceFiles, watchOpts)
    .on('add', filePath => handleFileChange('added', filePath))
    .on('addDir', filePath => handleFileChange('added', filePath))
    .on('change', filePath => handleFileChange('changed', filePath))
    .on('unlink', filePath => handleFileChange('deleted', filePath))
    .on('unlinkDir', filePath => handleFileChange('deleted', filePath))

  // target
  if (targetGlob && browserSync) {
    chokidar.watch(targetGlob, watchOpts)
      .on('add', filePath => debouncedReload('added', filePath))
      .on('addDir', filePath => debouncedReload('added', filePath))
      .on('change', filePath => debouncedReload('changed', filePath))
  }

  console.log(`🔁  Watching for file changes …`)
}

const startServer = ({ source: { config, components, pages, templates }, target, adapters }) => {
  const browserSync = requireOptional('browser-sync', 'serve').create()

  browserSync.init({
    open: false,
    server: {
      baseDir: target
    }
  })

  console.log(`🌎  Serving generated site …`)

  return browserSync
}
