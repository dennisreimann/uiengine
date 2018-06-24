import { join, resolve } from 'path'
import { compile } from 'ejs'
import htmlescape from 'htmlescape'
import Color from 'color'
import locales from './locales'
import { copyFile, readFile } from './file'
import { highlight, localize, dasherize, titleize } from './util'

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

// template helpers
const helpers = {
  htmlescape,
  dasherize,
  titleize,

  color (value) {
    const color = Color(value)

    return {
      hex: color.hex().toString(),
      rgb: color.rgb().toString(),
      hsl: color.hsl().toString().replace(/(\(\d+\.(\d{1,3}))\d+/, '$1') // shorten the first values decimal places
    }
  },

  localize (locale, key, interpolations) {
    const dict = locales[locale]

    return localize(dict, key, interpolations)
  }
}

async function copyStatic (target) {
  await copyFile(staticPath, target)
}

async function compileTemplate (name) {
  const templateString = await readFile(templatePath(name))

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

export async function render (options, template = 'index', data = null) {
  // sanitize and prepare options
  if (!supportedLocales.includes(options.lang)) delete options.lang
  const opts = Object.assign({}, defaultOpts, options)
  const basePath = opts.base.replace(/\/$/, '')
  const context = Object.assign({ basePath, helpers }, data, opts)

  try {
    if (!options.cache) await compileTemplate(template)

    const templateFn = templates[template]
    const rendered = templateFn(context)

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
