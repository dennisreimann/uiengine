import fs from 'fs'
import path from 'path'
import compile from 'lodash.template'
import { highlight } from './util'
import File from 'uiengine/lib/util/file'

const supportedLocales = ['en', 'de']
const defaultOpts = {
  lang: 'en',
  skin: 'default',
  hljs: 'atom-one-dark'
}

// template is loaded on setup
let templateFn = null
const templatePath = path.resolve(__dirname, '..', 'lib', 'template.ejs')
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

        if (options.debug) message.push(JSON.stringify(options, null, 2))

        reject(message.join('\n\n'))
      } else {
        templateFn = compile(templateString)

        resolve()
      }
    })
  })
}

export async function render (options, state, change) {
  // generate the index page if this is a full render (no change)
  if (change) return

  // sanitize and prepare options
  if (!supportedLocales.includes(options.lang)) delete options.lang
  const opts = Object.assign({}, defaultOpts, options)
  const context = Object.assign({}, { state }, opts)

  try {
    const rendered = templateFn(context)
    const filePath = path.resolve(state.config.target, 'index.html')

    await File.write(filePath, rendered)
  } catch (err) {
    const message = ['Theme could not render!', err]

    if (options.debug) message.push(JSON.stringify(context, null, 2))

    throw new Error(message.join('\n\n'))
  }
}
