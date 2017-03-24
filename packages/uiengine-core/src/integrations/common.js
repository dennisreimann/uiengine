const path = require('path')
const UIengine = require('../uiengine')
const debounce = require('../util/debounce')

const sourceFilesFromConfig = ({ source: { configFile, components, pages, templates }, adapters, debug }) => {
  const exts = '.{' + Object.keys(adapters).concat('md').join(',') + '}'
  const componentsGlob = components ? path.join(components, '**/*' + exts) : null
  const templatesGlob = templates ? path.join(templates, '**/*' + exts) : null
  const pagesGlob = templates ? path.join(pages, '**') : null
  const themeGlob = debug ? path.join(process.cwd(), 'node_modules/uiengine-theme-default/{lib,static}', '**') : null
  const sourceFiles = [configFile, componentsGlob, templatesGlob, pagesGlob, themeGlob].filter(a => a)

  return sourceFiles
}

const handleFileChange = (filePath, type) => debounce('reload', () => {
  UIengine.generateIncrementForFileChange(filePath, type)
    .then(change => console.log(`✨  Rebuilt ${change.type} ${change.item} (${change.action} ${change.file})`))
    .catch(error => console.log(`🚨  Error generating increment for changed file ${path.relative(process.cwd(), filePath)}:`, error))
})

module.exports = {
  sourceFilesFromConfig,
  handleFileChange
}
