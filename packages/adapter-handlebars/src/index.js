const { readFile } = require('fs')
const { basename, extname } = require('path')
const Handlebars = require('handlebars')

async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        reject(err)
      } else {
        const name = basename(filePath, extname(filePath))
        const id = options.namespace ? `${options.namespace}/${name}` : name

        Handlebars.registerPartial(id, raw)

        resolve()
      }
    })
  })
}

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        reject(err)
      } else {
        try {
          const template = Handlebars.compile(raw)
          const rendered = template(data)

          resolve(rendered)
        } catch (err) {
          const message = [`Handlebars could not render "${filePath}"!`, err]

          if (options.debug) message.push(raw, JSON.stringify(data, null, 2))

          reject(message.join('\n\n'))
        }
      }
    })
  })
}

module.exports = {
  registerComponentFile,
  render
}
