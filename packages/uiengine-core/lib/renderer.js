const path = require('path')
const glob = require('globby')
const R = require('ramda')
const fs = require('fs')
const hbs = require('handlebars')
const layouts = require('handlebars-layout')
const File = require('./util/file')
const hbsNativeHelpers = require('./util/handlebarsNativeHelpers')

// FIXME: It's kinda ugly to throw this in here
layouts.register(hbs)

let templateCache = {}

const templateOptions = { preventIndent: true }

async function registerHelpersFromFile (filePath) {
  return new Promise((resolve, reject) => {
    try {
      const modulePath = path.resolve(filePath)
      const helpers = require(modulePath)
      const names = (Object.keys(helpers) || [])

      names.map(name => hbs.registerHelper(name, helpers[name]))

      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

async function registerPartialFromFile (partialId, filePath) {
  const string = await File.read(filePath)
  const raw = string.trim()
  hbs.registerPartial(partialId, raw)
}

async function registerTemplateFromFile (templateId, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        reject(err)
      } else {
        const raw = string.trim()
        putTemplate(templateId, raw)
          .then(resolve)
      }
    })
  })
}

const registerThemePartialFromFile = (filePath) => {
  const partialId = path.basename(filePath, path.extname(filePath))

  return registerPartialFromFile(partialId, filePath)
}

const registerThemeTemplateFromFile = (filePath) => {
  const templateId = path.basename(filePath, path.extname(filePath))

  return registerTemplateFromFile(templateId, filePath)
}

const unregisterCustomHelper = (helperId) => {
  if (!hbsNativeHelpers.includes(helperId)) {
    hbs.unregisterHelper(helperId)
  }
}

const unregisterPartial = (partialId) => {
  hbs.unregisterPartial(partialId)
}

async function setupContext (state) {
  const themePath = state.config.basedirs.theme
  const helpersPath = path.resolve(themePath, 'helpers.js')
  const partialsGlob = path.resolve(themePath, 'partials', '**', '*.hbs')
  const templatesGlob = path.resolve(themePath, 'templates', '**', '*.hbs')
  const [partialPaths, templatePaths] = await Promise.all([glob(partialsGlob), glob(templatesGlob)])

  const registerHelpers = registerHelpersFromFile(helpersPath)
  const registerPartials = R.map(registerThemePartialFromFile, partialPaths)
  const registerTemplates = R.map(registerThemeTemplateFromFile, templatePaths)

  await Promise.all([registerHelpers, ...registerPartials, ...registerTemplates])
}

async function teardownContext (state) {
  R.map(unregisterCustomHelper, Object.keys(hbs.helpers))
  R.map(unregisterPartial, Object.keys(hbs.partials))

  await Promise.all([clearTemplates()])
}

async function clearTemplates () {
  return new Promise((resolve, reject) => {
    templateCache = {}
    resolve()
  })
}

async function getTemplate (templateId) {
  return new Promise((resolve, reject) => {
    const template = templateCache[templateId]
    if (template) {
      resolve(template)
    } else {
      const err = new Error(`Template ${templateId} does not exist.`)
      reject(err)
    }
  })
}

async function putTemplate (templateId, raw) {
  return new Promise((resolve, reject) => {
    templateCache[templateId] = hbs.compile(raw, templateOptions)
    resolve()
  })
}

async function renderTemplate (state, templateId, data = {}) {
  const template = await getTemplate(templateId)
  return template(data)
}

module.exports = {
  setupContext,
  teardownContext,
  putTemplate,
  getTemplate,
  renderTemplate,
  clearTemplates
}
