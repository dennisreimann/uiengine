const { join } = require('path')
const R = require('ramda')
const glob = require('globby')
const File = require('./util/file')
const { error } = require('./util/message')
const { debug3 } = require('./util/debug')

const getModule = ({ config: { adapters } }, ext, filePath) => {
  const { module } = adapters[ext] || {}
  if (!module) {
    throw new Error(error(`You have not configured the "${ext}" adapter.`, `Cannot handle ${filePath}.`))
  }

  try {
    return require(module)
  } catch (err) {
    throw new Error(error(`Could not load "${ext}" adapter:`, err.stack))
  }
}

export async function setup (state) {
  debug3(state, 'Connector.setup():start')

  const { config: { adapters, source: { components } } } = state
  const exts = Object.keys(adapters) || []
  const tasks = []

  exts.map((ext) => {
    const { registerComponentFile } = getModule(state, ext)

    // register components: only files with the extension
    // in the components source folder root. No variants!
    if (typeof registerComponentFile === 'function') {
      const { options } = adapters[ext]

      const pattern = join(components, `*/*.${ext}`)
      const paths = glob.sync(pattern)
      const register = R.partial(registerComponentFile, [options])
      const registers = R.map(register, paths)

      tasks.push(...registers)
    }
  })

  await Promise.all(tasks)

  debug3(state, 'Connector.setup():end')
}

export async function registerComponentFile (state, filePath) {
  const { config: { adapters } } = state
  const ext = File.extension(filePath)
  const adapter = adapters[ext]

  if (adapter) {
    const { registerComponentFile } = getModule(state, ext, filePath)

    if (typeof registerComponentFile === 'function') {
      const { options } = adapter
      await registerComponentFile(options, filePath)
    }
  }
}

export async function render (state, templatePath, data = {}) {
  const { config: { adapters } } = state
  const ext = File.extension(templatePath)
  const { render } = getModule(state, ext, templatePath)

  if (typeof render === 'function') {
    const { options } = adapters[ext]
    const rendered = await render(options, templatePath, data)
    const result = typeof rendered === 'string' ? { rendered, parts: [{ title: 'HTML', lang: 'html', content: rendered }] } : rendered

    return result
  } else {
    throw new Error(error(`The "${ext}" adapter does not support rendering.`))
  }
}

export async function filesForComponent (state, ext, componentName) {
  const { filesForComponent } = getModule(state, ext)

  if (typeof filesForComponent === 'function') {
    const files = await filesForComponent(componentName)

    return files
  } else {
    return []
  }
}

export async function filesForVariant (state, ext, componentName, variantName) {
  const { filesForVariant } = getModule(state, ext)

  if (typeof filesForVariant === 'function') {
    const files = await filesForVariant(componentName, variantName)

    return files
  } else {
    return []
  }
}
