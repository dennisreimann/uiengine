import path from 'path'
import pug from 'pug'
import helpers from './helpers'

const templatesPath = path.resolve(__dirname, '..', 'templates')

const pugOpts = {
  basedir: templatesPath,
  pretty: true,
  cache: true
}

export const staticPath = path.resolve(__dirname, '..', 'static')

export async function render (id, data = {}) {
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
