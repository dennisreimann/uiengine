const path = require('path')
const pug = require('pug')

let templateCache = {}

async function renderTemplate (templateId, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    let template = templateCache[templateId]

    if (!template) {
      const templateFileName = `${templateId}.pug`
      const { templatesPath } = opts
      const templatePath = path.resolve(templatesPath, templateFileName)

      try {
        template = pug.compileFile(templatePath, {
          pretty: true,
          cache: true,
          filename: templateFileName,
          basedir: templatesPath
        })
      } catch (err) {
        reject(`Pug could not compile template "${templateId}".\n\n${err.stack}`)
      }

      templateCache[templateId] = template
    }

    const rendered = template(data)
    resolve(rendered)
  })
}

async function renderString (templateString, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    const templateId = templateString
    let template = templateCache[templateId]

    if (!template) {
      const { componentsPath, filePath } = opts

      try {
        template = pug.compile(templateString, {
          pretty: true,
          cache: true,
          filename: filePath,
          basedir: componentsPath
        })
      } catch (err) {
        reject(`Pug could not compile template string:\n\n${templateString}\n\n${err.message}`)
      }

      templateCache[templateId] = template
    }

    const rendered = template(data)
    resolve(rendered)
  })
}

module.exports = {
  renderTemplate,
  renderString
}
