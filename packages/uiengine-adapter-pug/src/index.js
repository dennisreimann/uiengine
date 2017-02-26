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

module.exports = {
  render
}
