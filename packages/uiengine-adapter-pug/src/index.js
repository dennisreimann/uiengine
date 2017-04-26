const pug = require('pug')

const render = (options, filePath, data = {}) =>
  new Promise((resolve, reject) => {
    const context = Object.assign({}, options, data)

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      const message = [`Pug could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(context, null, '  '))

      reject(message.join('\n\n'))
    }
  })

const filesForComponent = (componentName) =>
  [
    {
      basename: `${componentName}.pug`,
      data: `mixin ${componentName}()\n  .${componentName}\n    //- TODO: implement\n`
    }
  ]

const filesForVariant = (componentName, variantName) =>
  [
    {
      basename: `${variantName}.pug`,
      data: `+${componentName}()\n`
    }
  ]

module.exports = {
  render,
  filesForComponent,
  filesForVariant
}
