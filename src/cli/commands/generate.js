const path = require('path')
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

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }

  UIengine.generate(opts)
    .then(({ config }) => {
      console.log(`✅  ${config.name} generated!`)

      if (argv.watch) startWatcher(config)
    })
    .catch((err) => {
      console.error([`🚨  generating the site failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}

const requireChokidar = () => {
  try {
    return require('chokidar')
  } catch (err) {
    console.error('The optional dependency chokidar failed to install and is required for --watch. Chokidar is likely not supported on your platform.')
    throw err
  }
}

const startWatcher = ({ source: { config, components, pages, templates }, target, adapters }) => {
  const chokidar = requireChokidar()
  console.log(`🔁  Watching for file changes …`)

  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**/*') : null

  const files = [
    config,
    componentsGlob,
    templatesGlob,
    pagesGlob
  ].filter(a => a)

  const log = console.log.bind(console)
  const handleFileChange = (type, filePath) => {
    UIengine.generateIncrementForFileChange(filePath, type)
      .then(change => log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`))
      .catch(error => log(`🚨  Error generating increment for changed file ${path.relative(__dirname, filePath)}:`, error))
  }

  chokidar.watch(files, {
    ignoreInitial: true,
    awaitWriteFinish: {
      pollInterval: 50,
      stabilityThreshold: 50
    }
  })
    .on('add', filePath => handleFileChange('added', filePath))
    .on('addDir', filePath => handleFileChange('added', filePath))
    .on('change', filePath => handleFileChange('changed', filePath))
    .on('unlink', filePath => handleFileChange('deleted', filePath))
    .on('unlinkDir', filePath => handleFileChange('deleted', filePath))
}
