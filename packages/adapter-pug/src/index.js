const pug = require('pug')
const { extractDependentFiles, extractDependencyFiles } = require('./deps')

async function render (options, filePath, data = {}) {
  const context = Object.assign({}, options, data)

  return pug.renderFile(filePath, context)
}

async function registerComponentFile (options, filePath) {
  const [dependentFiles, dependencyFiles] = await Promise.all([
    extractDependentFiles(options, filePath),
    extractDependencyFiles(options, filePath)
  ])

  const info = {}
  if (Object.keys(dependentFiles).length > 0) info.dependentFiles = dependentFiles
  if (Object.keys(dependencyFiles).length > 0) info.dependencyFiles = dependencyFiles

  return info
}

const filesForComponent = (componentName) =>
  [
    {
      basename: `${componentName}.pug`,
      data: `mixin ${componentName}()\n  .${componentName}&attributes(attributes)\n    //- TODO: implement\n`
    }
  ]

const filesForVariant = (componentName, variantName) =>
  [
    {
      basename: `${variantName}.pug`,
      data: `include ../${componentName}.pug\n\n+${componentName}()\n`
    }
  ]

module.exports = {
  filesForComponent,
  filesForVariant,
  registerComponentFile,
  render
}
