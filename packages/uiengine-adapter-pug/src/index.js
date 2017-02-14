const pug = require('pug')

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    const context = Object.assign({}, options, data)

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      reject([
        `Pug could not render "${filePath}"!`,
        err.stack,
        JSON.stringify(context, null, '  ')
      ].join('\n\n'))
    }
  })
}

module.exports = {
  render
}
