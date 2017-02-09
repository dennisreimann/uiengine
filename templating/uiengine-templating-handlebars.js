const File = require('../lib/util/file')
let Handlebars

try {
  Handlebars = require('handlebars')
} catch (err) {
  console.error('Please add "handlebars" to your projects dependencies as it is required for the uiengine-templating-handlebars adapter!')
  throw err
}

async function setup () {
  return new Promise((resolve, reject) => {
    console.log('hbs setup')
    resolve()
  })
}

async function registerComponent (filePath) {
  return new Promise((resolve, reject) => {
    console.log('hbs component', filePath)
    resolve()
  })
}

async function registerTemplate (filePath) {
  return new Promise((resolve, reject) => {
    console.log('hbs template', filePath)
    resolve()
  })
}

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
  setup,
  registerComponent,
  registerTemplate,
  renderTemplate,
  renderString
}
