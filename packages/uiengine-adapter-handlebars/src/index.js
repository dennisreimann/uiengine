const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        reject(err)
      } else {
        const name = path.basename(filePath, path.extname(filePath))
        const id = options.namespace ? `${options.namespace}/${name}` : name

        Handlebars.registerPartial(id, raw)

        resolve()
      }
    })
  })
}

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        reject(err)
      } else {
        try {
          const template = Handlebars.compile(raw)
          const rendered = template(data)

          resolve(rendered)
        } catch (err) {
          reject([
            `Handlebars could not render "${filePath}"!`,
            err.stack,
            raw,
            JSON.stringify(data, null, '  ')
          ].join('\n\n'))
        }
      }
    })
  })
}

module.exports = {
  registerComponentFile,
  render
}
