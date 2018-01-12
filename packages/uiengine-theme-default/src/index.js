import path from 'path'
import compile from 'lodash.template'
import File from 'uiengine/lib/util/file'
import { highlight } from './util'

const supportedLocales = ['en', 'de']
const defaultOpts = {
  lang: 'en',
  skin: 'default',
  hljs: 'atom-one-dark',
  cache: true
}

// template is loaded on setup
let templateFn = null
const templatePath = path.resolve(__dirname, '..', 'lib', 'template.ejs')
const staticPath = path.resolve(__dirname, '..', 'dist')

async function copyStatic (target) {
  await File.copy(staticPath, target)
}

async function compileTemplate () {
  const templateString = await File.read(templatePath)

  templateFn = compile(templateString)
}

export async function setup (options) {
  // configure markdown renderer
  const { markdownIt, target } = options
  markdownIt.set({ highlight })

  // load and assign template
  try {
    await Promise.all([
      compileTemplate(),
      copyStatic(target)
    ])
  } catch (err) {
    const message = ['Theme setup failed:', err]

    if (options.debug) message.push(JSON.stringify(options, null, 2))

    throw new Error(message.join('\n\n'))
  }
}

export async function render (options, state) {
  // sanitize and prepare options
  if (!supportedLocales.includes(options.lang)) delete options.lang
  const opts = Object.assign({}, defaultOpts, options)
  const context = Object.assign({}, { state }, opts)

  try {
    if (!options.cache) await compileTemplate()

    const rendered = templateFn(context)
    const { target } = options
    const filePath = path.resolve(target, 'index.html')

    await File.write(filePath, rendered)
  } catch (err) {
    const message = ['Theme could not render!', err]

    if (options.debug) message.push(JSON.stringify(context, null, 2))

    throw new Error(message.join('\n\n'))
  }
}
