const { join, resolve } = require('path')
const { compile } = require('ejs')
const htmlescape = require('htmlescape')
const merge = require('deepmerge')
const Color = require('color')
const defaultLocales = require('./locales')
const highlight = require('./shared/highlight')
const localize = require('./shared/localize')
const {
  FileUtil: { read, copy },
  StringUtil: { dasherize, titleize }
} = require('@uiengine/util')

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
  await copy(staticPath, target)
}

async function compileTemplate (name) {
  const templateString = await read(templatePath(name))

  templates[name] = compile(templateString)
}

async function setup (options) {
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

async function render (options, template = 'index', data = null) {
  // sanitize and prepare options, merge UI locales
  const customLocales = options.locales || {}
  const locales = merge(defaultLocales, customLocales)
  delete options.locales
  const supportedLocales = Object.keys(locales)
  if (!supportedLocales.includes(options.lang)) delete options.lang

  const opts = Object.assign({}, defaultOpts, options)
  const basePath = opts.base.replace(/\/$/, '')
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

module.exports = {
  setup,
  render
}
