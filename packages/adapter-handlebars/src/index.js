const { readFile } = require('fs')
const { basename, extname } = require('path')
const Handlebars = require('handlebars')

const handleError = (options, err, reject, filePath, raw, data) => {
  const message = [`Handlebars could not handle "${filePath}"!`, err]

  if (options.debug) message.push(raw, JSON.stringify(data, null, 2))

  const error = new Error(message.join('\n\n'))
  error.code = err.code
  error.path = filePath

  reject(error)
}

export async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        handleError(options, err, reject, filePath, raw)
      } else {
        const name = basename(filePath, extname(filePath))
        const id = options.namespace ? `${options.namespace}/${name}` : name

        Handlebars.registerPartial(id, raw)

        resolve()
      }
    })
  })
}

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, raw) => {
      if (err) {
        handleError(options, err, reject, filePath, raw, data)
      } else {
        try {
          const template = Handlebars.compile(raw)
          const rendered = template(data)

          resolve(rendered)
        } catch (err) {
          handleError(options, err, reject, filePath, raw, data)
        }
      }
    })
  })
}
