const path = require('path')
const R = require('ramda')
const glob = require('globby')

const getAdapter = ({ config: { templating } }, extension) => {
  const module = templating[extension]

  try {
    return require(module)
  } catch (err) {
    throw new Error(`Could not load templating adapter for "${extension}" files.`)
  }
}

const optsWithPaths = (state, opts) => {
  const { components, templates } = state.config.source

  opts = R.assoc('templatesPath', templates, opts)
  opts = R.assoc('componentsPath', components, opts)

  return opts
}

async function renderTemplate (state, templatePath, data = {}, opts = {}) {
  const extension = path.extname(templatePath).replace(/^\./, '')
  const adapter = getAdapter(state, extension)
  opts = optsWithPaths(state, opts)

  const rendered = await adapter.renderTemplate(templatePath, data, opts)

  return rendered
}

async function renderString (state, extension, templateString, data = {}, opts = {}) {
  const adapter = getAdapter(state, extension)
  opts = optsWithPaths(state, opts)

  const rendered = await adapter.renderString(templateString, data, opts)

  return rendered
}

async function setup (state, opts = {}) {
  const { config } = state
  const { components, templates } = config.source
  const templatingAdapters = Object.keys(config.templating) || []
  const tasks = []

  templatingAdapters.map((extension) => {
    const { setup, registerComponent, registerTemplate } = getAdapter(state, extension)

    // general setup
    if (typeof setup === 'function') {
      opts = optsWithPaths(state, opts)
      tasks.push(setup(opts))
    }

    // register components: only files with the extension
    // in the components source folder root. No variations!
    if (typeof registerComponent === 'function') {
      const pattern = path.join(components, `*/*.${extension}`)
      const paths = glob.sync(pattern)
      const registers = R.map(registerComponent, paths)

      tasks.push(...registers)
    }

    // register templates: every file with the extension
    // in the templates source folder
    if (typeof registerTemplate === 'function') {
      const pattern = path.join(templates, `**/*.${extension}`)
      const paths = glob.sync(pattern)
      const registers = R.map(registerTemplate, paths)

      tasks.push(...registers)
    }
  })

  await Promise.all(tasks)

  return state
}

module.exports = {
  setup,
  renderTemplate,
  renderString
}

