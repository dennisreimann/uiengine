import { join, resolve } from 'path'
import { compile } from 'ejs'
import htmlescape from 'htmlescape'
import File from '@uiengine/core/lib/util/file'
import { highlight } from './util'

const supportedLocales = ['en', 'de']
const defaultOpts = {
  lang: 'en',
  hljs: 'atom-one-dark',
  base: '/',
  cache: true,
  customStylesFile: null
}

// templates are loaded on setup
const templates = {}
const templatesPath = resolve(__dirname, '..', 'lib', 'templates')
const staticPath = resolve(__dirname, '..', 'dist')
const templatePath = template => join(templatesPath, `${template}.ejs`)

async function copyStatic (target) {
  await File.copy(staticPath, target)
}

async function compileTemplate (name) {
  const templateString = await File.read(templatePath(name))

  templates[name] = compile(templateString)
}

export async function setup (options) {
  // configure markdown renderer
  const { markdownIt, target } = options
  markdownIt.set({ highlight })

  // load and assign template
  try {
    await Promise.all([
      compileTemplate('index'),
      compileTemplate('sketch'),
      copyStatic(target)
    ])
  } catch (err) {
    const message = ['UI setup failed:', err]

    if (options.debug) message.push(JSON.stringify(options, null, 2))

    throw new Error(message.join('\n\n'))
  }
}

export async function render (options, state, template = 'index') {
  // sanitize and prepare options
  if (!supportedLocales.includes(options.lang)) delete options.lang
  const opts = Object.assign({}, defaultOpts, options)
  const basePath = opts.base.replace(/\/$/, '')
  const context = Object.assign({ htmlescape, basePath }, { state }, opts)

  try {
    if (!options.cache) await compileTemplate(template)

    const templateFn = templates[template]
    const rendered = templateFn(context)

    if (template === 'index') {
      const { target } = options
      const filePath = resolve(target, 'index.html')

      await File.write(filePath, rendered)
    }

    return rendered
  } catch (err) {
    const message = [`UI could not render template "${template}":`, err]

    if (options.debug) message.push(JSON.stringify(context, null, 2))

    const error = new Error(message.join('\n\n'))
    error.code = err.code
    error.path = templatePath(template)

    throw error
  }
}
