const path = require('path')
const R = require('ramda')
const glob = require('globby')

const getAdapter = ({ config: { templating } }, ext) => {
  const module = templating[ext]

  try {
    return require(module)
  } catch (err) {
    throw new Error(`Could not load templating adapter for "${ext}" files:\n\n${err.stack}`)
  }
}

const extension = (filePath) =>
  path.extname(filePath).replace(/^\./, '')

async function render (state, templatePath, data = {}) {
  const ext = extension(templatePath)
  const adapter = getAdapter(state, ext)
  const { components, templates } = state.config.source
  const opts = { components, templates }

  const rendered = await adapter.render(templatePath, data, opts)

  return rendered
}

async function registerComponents (state) {
  const { config } = state
  const adapters = Object.keys(config.templating) || []
  const tasks = []

  adapters.map((ext) => {
    const { registerComponent } = getAdapter(state, ext)

    // register components: only files with the extension
    // in the components source folder root. No variations!
    if (typeof registerComponent === 'function') {
      const pattern = path.join(config.source.components, `*/*.${ext}`)
      const paths = glob.sync(pattern)
      const registers = R.map(registerComponent, paths)

      tasks.push(...registers)
    }
  })

  await Promise.all(tasks)
}

async function registerComponent (state, filePath) {
  const { config } = state
  const ext = extension(filePath)

  if (config.templating[ext]) {
    const { registerComponent } = getAdapter(state, ext)

    if (typeof registerComponent === 'function') {
      await registerComponent(filePath)
    }
  }
}

// TODO: Offer hook to update templates and components

module.exports = {
  registerComponents,
  registerComponent,
  render
}

