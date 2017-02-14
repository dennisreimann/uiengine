const path = require('path')
const pug = require('pug')
const helpers = require('./helpers')

const assetsPath = path.resolve(__dirname, '..', 'assets')
const templatesPath = path.resolve(__dirname, '..', 'templates')

const pugOpts = {
  basedir: templatesPath,
  pretty: true,
  cache: true
}

async function render (id, data = {}) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(templatesPath, `${id}.pug`)
    const context = Object.assign({}, pugOpts, data, { h: helpers(data) })

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      reject([
        `Pug could not render "${filePath}"!`,
        err.stack,
        JSON.stringify(context, null, '  ')
      ].join('\n\n'))
    }
  })
}

module.exports = {
  assetsPath,
  render
}
