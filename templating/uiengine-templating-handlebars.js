const path = require('path')
const File = require('../lib/util/file')
let Handlebars

try {
  Handlebars = require('handlebars')
} catch (err) {
  console.error('Please add "handlebars" to the dependencies. It is required by the uiengine-templating-handlebars adapter.')
  throw err
}

// async function setup (opts = {}) {
//   return new Promise((resolve, reject) => {
//     console.log('hbs setup')
//     resolve()
//   })
// }

async function registerComponent (filePath, opts = {}) {
  const raw = await File.read(filePath)
  const id = path.basename(filePath, path.extname(filePath))

  Handlebars.registerPartial(id, raw)
}

// async function registerTemplate (filePath, opts = {}) {
//   return new Promise((resolve, reject) => {
//     console.log('hbs template', filePath)
//     resolve()
//   })
// }

async function renderTemplate (templatePath, data = {}, opts = {}) {
  const templateString = await File.read(templatePath)

  return renderString(templateString, data, opts)
}

async function renderString (templateString, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const template = Handlebars.compile(templateString)
      const rendered = template(data)

      resolve(rendered)
    } catch (err) {
      reject(`Handlebars could not render template string: ${err.message}\n\n${templateString}\n\n${JSON.stringify(data, null, '  ')}`)
    }
  })
}

module.exports = {
  // setup,
  registerComponent,
  // registerTemplate,
  renderTemplate,
  renderString
}
