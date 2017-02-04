const path = require('path')
const R = require('ramda')
const pug = require('pug')
const helpers = require('./helpers')

const assetsPath = path.resolve(__dirname, 'assets')
const templatesPath = path.resolve(__dirname, 'templates')

const pugOpts = {
  basedir: templatesPath,
  pretty: true
}

let templateCache = {}

async function renderTemplate (id, data = {}) {
  return new Promise((resolve, reject) => {
    let template = templateCache[id]
    if (!template) {
      const fileName = `${id}.pug`
      const templatePath = path.resolve(templatesPath, fileName)
      try {
        template = pug.compileFile(templatePath, pugOpts)
      } catch (err) {
        reject(`Pug could not compile template "${id}".\n\n${err.stack}`)
      }
      templateCache[id] = template
    }

    // assign helper functions
    data = R.assoc('h', helpers(data), data)
    const rendered = template(data)
    resolve(rendered)
  })
}

module.exports = {
  assetsPath,
  renderTemplate
}
