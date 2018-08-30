const { renderFile } = require('ejs')

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    renderFile(filePath, data, options, (error, rendered) => {
      if (error) {
        reject(error)
      } else {
        resolve(rendered)
      }
    })
  })
}

function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.ejs`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

function filesForVariant (componentName, variantName) {
  return [
    {
      basename: `${variantName}.ejs`,
      data: `<%- include ../${componentName} -%>\n`
    }
  ]
}

module.exports = {
  render,
  filesForComponent,
  filesForVariant
}
