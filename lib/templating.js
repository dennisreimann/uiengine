const path = require('path')
const R = require('ramda')
const glob = require('globby')

const extension = (filePath) =>
  path.extname(filePath).replace(/^\./, '')

const getAdapter = ({ config: { templating } }, ext) => {
  const { module } = templating[ext]

  try {
    return require(module)
  } catch (err) {
    throw new Error(`Could not load templating adapter for "${ext}" files:\n\n${err.stack}`)
  }
}

async function render (state, templatePath, data = {}) {
  const { config: { templating } } = state
  const ext = extension(templatePath)
  const adapter = getAdapter(state, ext)
  const { options } = templating[ext]

  const rendered = await adapter.render(options, templatePath, data)

  return rendered
}

async function setup (state) {
  const { config: { source: { components }, templating } } = state
  const exts = Object.keys(templating) || []
  const tasks = []

  exts.map((ext) => {
    const { registerComponent } = getAdapter(state, ext)

    // register components: only files with the extension
    // in the components source folder root. No variations!
    if (typeof registerComponent === 'function') {
      const { options } = templating[ext]
      const pattern = path.join(components, `*/*.${ext}`)
      const paths = glob.sync(pattern)
      const register = R.partial(registerComponent, [options])
      const registers = R.map(register, paths)

      tasks.push(...registers)
    }
  })

  await Promise.all(tasks)
}

async function registerComponent (state, filePath) {
  const { config: { templating } } = state
  const ext = extension(filePath)
  const adapter = templating[ext]

  if (adapter) {
    const { options } = adapter
    const { registerComponent } = getAdapter(state, ext)

    if (typeof registerComponent === 'function') {
      await registerComponent(options, filePath)
    }
  }
}

// TODO: Offer hook to update templates and components

module.exports = {
  setup,
  registerComponent,
  render
}

