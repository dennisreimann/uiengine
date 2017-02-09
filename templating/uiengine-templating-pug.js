const pug = require('pug')
const R = require('ramda')

async function setup () {
  return new Promise((resolve, reject) => {
    console.log('pug setup')
    resolve()
  })
}

async function registerComponent (filePath) {
  return new Promise((resolve, reject) => {
    console.log('pug component', filePath)
    resolve()
  })
}

async function registerTemplate (filePath) {
  return new Promise((resolve, reject) => {
    console.log('pug template', filePath)
    resolve()
  })
}

async function renderTemplate (templatePath, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    const { templatesPath } = opts
    const context = R.merge({
      pretty: true,
      cache: true,
      filename: templatePath,
      basedir: templatesPath
    }, data)

    try {
      const rendered = pug.renderFile(templatePath, context)

      resolve(rendered)
    } catch (err) {
      reject(`Pug could not render template "${templatePath}": ${err.stack}\n\n${JSON.stringify(data, null, '  ')}`)
    }
  })
}

async function renderString (templateString, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    const { componentsPath, filePath } = opts
    const context = R.merge({
      pretty: true,
      cache: true,
      filename: filePath,
      basedir: componentsPath
    }, data)

    try {
      const rendered = pug.render(templateString, context)

      resolve(rendered)
    } catch (err) {
      reject(`Pug could not render template string: ${err.message}\n\n${templateString}\n\n${JSON.stringify(data, null, '  ')}`)
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
