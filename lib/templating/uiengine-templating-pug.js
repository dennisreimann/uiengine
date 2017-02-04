const path = require('path')
const pug = require('pug')

let templateCache = {}

async function renderTemplate ({ templates }, templateId, data = {}) {
  return new Promise((resolve, reject) => {
    let template = templateCache[templateId]
    if (!template) {
      const templateFile = `${templateId}.pug`
      const templatePath = path.resolve(templates, templateFile)

      try {
        template = pug.compileFile(templatePath, {
          pretty: true,
          cache: true,
          filename: templatePath,
          basedir: templates
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

async function renderString ({ components }, templateString, data = {}, opts = {}) {
  return new Promise((resolve, reject) => {
    const templateId = templateString
    let template = templateCache[templateId]
    if (!template) {
      try {
        template = pug.compile(templateString, {
          pretty: true,
          cache: true,
          filename: opts.path,
          basedir: components
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
