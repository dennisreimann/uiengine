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

async function renderTemplate (state, templatePath, data = {}, opts = {}) {
  const extension = path.extname(templatePath).replace(/^\./, '')
  const adapter = getAdapter(state, extension)
  const { components, templates } = state.config.source

  opts = R.assoc('templatesPath', templates, opts)
  opts = R.assoc('componentsPath', components, opts)

  const rendered = await adapter.renderTemplate(templatePath, data, opts)

  return rendered
}

async function renderString (state, extension, templateString, data = {}, opts = {}) {
  const adapter = getAdapter(state, extension)
  const { components, templates } = state.config.source

  opts = R.assoc('templatesPath', templates, opts)
  opts = R.assoc('componentsPath', components, opts)

  const rendered = await adapter.renderString(templateString, data, opts)

  return rendered
}

async function setup (state) {
  const { config } = state
  const { templates, components } = config.source
  const templatingAdapters = Object.keys(config.templating) || []
  const tasks = []

  templatingAdapters.map((extension) => {
    const { setup, registerComponent, registerTemplate } = getAdapter(state, extension)

    // general setup
    if (typeof setup === 'function') {
      tasks.push(setup())
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

async function teardown (state) {
  const templatingAdapters = Object.keys(state.config.templating) || []

  const tasks = R.map((extension) => {
    const adapter = getAdapter(state, extension)
    const task = typeof adapter.teardown === 'function' ? adapter.teardown() : true

    return task
  }, templatingAdapters)

  await Promise.all(tasks)

  return state
}

module.exports = {
  setup,
  renderTemplate,
  renderString,
  teardown
}

