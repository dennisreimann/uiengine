const { renderFile } = require('ejs')

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    renderFile(filePath, data, options, (err, rendered) => {
      if (err) {
        const message = [`EJS could not render "${filePath}"!`, err]

        if (options.debug) message.push(JSON.stringify(data, null, 2))

        const error = new Error(message.join('\n\n'))
        error.code = err.code
        error.path = filePath

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
