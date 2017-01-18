const path = require('path')
const glob = require('globby')
const R = require('ramda')
const Handlebars = require('./util/handlebars')

const registerThemeHelpers = (filePath) => {
  return Handlebars.registerHelpersFromFile(filePath)
}

const registerThemePartialFromFile = (filePath) => {
  const partialId = path.basename(filePath, path.extname(filePath))

  return Handlebars.registerPartialFromFile(partialId, filePath)
}

const registerThemeTemplateFromFile = (filePath) => {
  const templateId = path.basename(filePath, path.extname(filePath))

  return Handlebars.registerTemplateFromFile(templateId, filePath)
}

async function setupContext (state) {
  const themePath = state.config.basedirs.theme
  const helpersPath = path.resolve(themePath, 'helpers.js')
  const partialsGlob = path.resolve(themePath, 'partials', '**', '*.hbs')
  const templatesGlob = path.resolve(themePath, 'templates', '**', '*.hbs')
  const [ partialPaths, templatePaths ] = await Promise.all([
    glob(partialsGlob),
    glob(templatesGlob)
  ])

  const registerHelpers = registerThemeHelpers(helpersPath)
  const registerPartials = R.map(registerThemePartialFromFile, partialPaths)
  const registerTemplates = R.map(registerThemeTemplateFromFile, templatePaths)

  return Promise.all([registerHelpers, registerPartials, registerTemplates])
}

async function renderTemplate (state, templateId, data = {}) {
  const template = await Handlebars.getTemplate(templateId)
  return template(data)
}

module.exports = {
  setupContext,
  renderTemplate
}
