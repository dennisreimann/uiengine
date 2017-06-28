const path = require('path')
const UIengine = require('../uiengine')
const debounce = require('../util/debounce')

const sourceFilesFromConfig = ({ source: { configFile, components, data, schema, pages, templates }, adapters, debug }) => {
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**') : null
  const dataGlob = data ? path.join(data, '**') : null
  const schemaGlob = data ? path.join(schema, '**/*.yml') : null
  const themeGlob = debug ? path.join(process.cwd(), 'node_modules/uiengine-theme-default/{lib,static}', '**') : null
  const sourceFiles = [configFile, componentsGlob, dataGlob, schemaGlob, pagesGlob, templatesGlob, themeGlob].filter(a => a)

  return sourceFiles
}

const handleFileChange = (filePath, type) => debounce('handleFileChange', () => {
  if (UIengine.isGenerating()) return
  UIengine.generateIncrementForFileChange(filePath, type)
    .then(change => console.log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`))
    .catch(error => console.log(`🚨  Error generating increment for changed file ${path.relative(process.cwd(), filePath)}:`, error))
})

// see https://github.com/paulmillr/chokidar#api
const watchOptions = {
  ignoreInitial: true,
  awaitWriteFinish: true
}

// see https://www.browsersync.io/docs/options/
const browserSyncOptions = {
  notify: false,
  reloadThrottle: 1000,
  watchOptions
}

module.exports = {
  sourceFilesFromConfig,
  handleFileChange,
  watchOptions,
  browserSyncOptions
}
