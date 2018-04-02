const { renderFile } = require('ejs')

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    renderFile(filePath, data, options, (err, rendered) => {
      if (err) {
        const message = [`EJS could not render "${filePath}"!`, err]

        if (options.debug) message.push(JSON.stringify(data, null, 2))

        reject(message.join('\n\n'))
      } else {
        resolve(rendered)
      }
    })
  })
}

export function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.ejs`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

export function filesForVariant (componentName, variantName) {
  return [
    {
      basename: `${variantName}.ejs`,
      data: `<%- include ../${componentName} -%>\n`
    }
  ]
}
