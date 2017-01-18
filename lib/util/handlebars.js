const fs = require('fs')
const path = require('path')
const hbs = require('handlebars')
const layouts = require('handlebars-layout')

// FIXME: It's kinda ugly to throw this in here
layouts.register(hbs)

let templateCache = {}
const templateOptions = { preventIndent: true }

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
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        reject(err)
      } else {
        const raw = string.trim()
        hbs.registerPartial(partialId, raw)

        resolve()
      }
    })
  })
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

module.exports = {
  registerHelpersFromFile,
  registerPartialFromFile,
  registerTemplateFromFile,
  clearTemplates,
  putTemplate,
  getTemplate
}
