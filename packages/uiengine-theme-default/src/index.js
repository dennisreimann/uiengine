import fs from 'fs'
import path from 'path'
import compile from 'lodash.template'
import { highlight } from './util'

const supportedLocales = ['en', 'de']
const defaultOpts = {
  lang: 'en',
  skin: 'default',
  hljs: 'atom-one-dark'
}

// template is loaded on setup
let templateFn = null
const templatePath = path.resolve(__dirname, '..', 'lib', 'index.html')
export const staticPath = path.resolve(__dirname, '..', 'dist')

export async function setup (options) {
  return new Promise((resolve, reject) => {
    // configure markdown renderer
    const { markdownIt } = options
    markdownIt.set({ highlight })

    // load and assign template
    fs.readFile(templatePath, 'utf8', (err, templateString) => {
      if (err) {
        const message = [`Theme could not load template "${templatePath}"!`, err]

        if (options.debug) message.push(JSON.stringify(options, null, '  '))

        reject(message.join('\n\n'))
      } else {
        templateFn = compile(templateString)

        resolve()
      }
    })
  })
}

export async function render (options, id, data = {}) {
  return new Promise((resolve, reject) => {
    // generate only the index page, all other pages are rendered client-side
    if (data.pageId !== 'index') resolve(null)

    // sanitize and prepare options
    if (!supportedLocales.includes(options.lang)) delete options.lang
    const opts = Object.assign({}, defaultOpts, options)
    const context = Object.assign({}, data, opts)

    try {
      const rendered = templateFn(context)

      resolve(rendered)
    } catch (err) {
      const message = [`Theme could not render "${data.pageId}"!`, err]

      if (options.debug) message.push(JSON.stringify(context, null, '  '))

      reject(message.join('\n\n'))
    }
  })
}
