const pug = require('pug')

async function render (options, filePath, data = {}) {
  const context = Object.assign({}, options, data)

  return pug.renderFile(filePath, context)
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
  render
}
