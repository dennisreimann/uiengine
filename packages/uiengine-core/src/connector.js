const path = require('path')
const R = require('ramda')
const glob = require('globby')

const extension = (filePath) =>
  path.extname(filePath).replace(/^\./, '')

const getModule = ({ config: { adapters } }, ext) => {
  const { module } = adapters[ext]

  try {
    return require(module)
  } catch (err) {
    throw new Error(`Could not load "${ext}" adapter:\n\n${err.stack}`)
  }
}

async function setup (state) {
  const { config: { adapters, source: { components } } } = state
  const exts = Object.keys(adapters) || []
  const tasks = []

  exts.map((ext) => {
    const { registerComponentFile } = getModule(state, ext)

    // register components: only files with the extension
    // in the components source folder root. No variations!
    if (typeof registerComponentFile === 'function') {
      const { options } = adapters[ext]
      const pattern = path.join(components, `*/*.${ext}`)
      const paths = glob.sync(pattern)
      const register = R.partial(registerComponentFile, [options])
      const registers = R.map(register, paths)

      tasks.push(...registers)
    }
  })

  await Promise.all(tasks)
}

async function registerComponentFile (state, filePath) {
  const { config: { adapters } } = state
  const ext = extension(filePath)
  const adapter = adapters[ext]

  if (adapter) {
    const { registerComponentFile } = getModule(state, ext)

    if (typeof registerComponentFile === 'function') {
      const { options } = adapter
      await registerComponentFile(options, filePath)
    }
  }
}

async function render (state, templatePath, data = {}) {
  const { config: { adapters } } = state
  const ext = extension(templatePath)
  const { render } = getModule(state, ext)

  if (typeof render === 'function') {
    const { options } = adapters[ext]
    const rendered = await render(options, templatePath, data)

    return rendered
  } else {
    throw new Error(`The "${ext}" adapter does not support rendering.`)
  }
}

module.exports = {
  setup,
  registerComponentFile,
  render
}

