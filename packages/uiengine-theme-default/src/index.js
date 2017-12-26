import fs from 'fs'
import path from 'path'
import compile from 'lodash.template'
import { createHelpers } from './helpers'

const componentsPath = path.resolve(__dirname, 'components')
const supportedLocales = ['en', 'de']
const templateOpts = {
  lang: 'en',
  skin: 'default',
  hljs: 'atom-one-dark'
}

export const staticPath = path.resolve(__dirname, '..', 'dist')

export async function setup (options) {
  return new Promise((resolve, reject) => {
    if (!supportedLocales.includes(options.lang)) delete options.lang

    const fileName = 'index.html'
    const templatePath = path.resolve(__dirname, '../lib', fileName)
    const context = Object.assign({}, templateOpts, options)

    fs.readFile(templatePath, 'utf8', (err, template) => {
      if (err) {
        reject(err)
      } else {
        const compiled = compile(template)
        const rendered = compiled(context)
        const filePath = path.join(options.target, fileName)

        fs.writeFile(filePath, rendered, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

export async function render (options, id, data = {}) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(componentsPath, 'layout', `${id}.pug`)
    const theme = { h: createHelpers(options, data) }
    const context = Object.assign({}, templateOpts, options, data, theme)

    try {
      const rendered = pug.renderFile(filePath, context)

      resolve(rendered)
    } catch (err) {
      const message = [`Pug could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(context, null, '  '))

      reject(message.join('\n\n'))
    }
  })
}
