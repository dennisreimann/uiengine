const pug = require('pug')

const render = (options, filePath, data = {}) =>
  new Promise((resolve, reject) => {
    const context = Object.assign({}, options, data)

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      const message = [`Pug could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(context, null, 2))

      reject(message.join('\n\n'))
    }
  })

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
  render,
  filesForComponent,
  filesForVariant
}
