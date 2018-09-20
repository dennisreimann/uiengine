const {
  UiengineInputError,
  ComponentUtil: { componentFilePathToId },
  DebugUtil: { debug3 },
  FileUtil: { extension }
} = require('@uiengine/util')

const getModule = ({ config: { adapters } }, ext, filePath) => {
  const { module } = adapters[ext] || {}
  if (!module) {
    throw new UiengineInputError(`Cannot handle ${filePath}: No "${ext}" adapter configured.`)
  }

  try {
    return require(module)
  } catch (err) {
    throw new UiengineInputError(`Cannot load "${ext}" adapter.`, err)
  }
}

const getOptions = (state, ext) => {
  const { config: { adapters, target, source: { components, templates } } } = state
  const { options } = adapters[ext]

  return Object.assign({}, options, { ext, components, templates, target })
}

async function setup (state) {
  debug3(state, 'Connector.setup():start')

  const { config: { adapters } } = state
  const exts = Object.keys(adapters || {})
  const tasks = []

  exts.map(ext => {
    const { setup } = getModule(state, ext)

    if (typeof setup === 'function') {
      const options = getOptions(state, ext)
      tasks.push(setup(options))
    }
  })

  await Promise.all(tasks)

  debug3(state, 'Connector.setup():end')
}

async function registerComponentFile (state, filePath) {
  const { config: { adapters, source: { components } } } = state
  const ext = extension(filePath)
  const adapter = adapters[ext]

  if (adapter) {
    const { registerComponentFile } = getModule(state, ext, filePath)

    if (typeof registerComponentFile === 'function') {
      const options = getOptions(state, ext)
      const data = await registerComponentFile(options, filePath)

      if (data) {
        const id = componentFilePathToId(components, filePath)

        return { id, filePath, data }
      }
    }
  }
}

async function render (state, templatePath, data = {}) {
  const ext = extension(templatePath)
  const { render } = getModule(state, ext, templatePath)

  if (typeof render === 'function') {
    const options = getOptions(state, ext)
    const rendered = await render(options, templatePath, data)
    const result = typeof rendered === 'string' ? { rendered, parts: [{ title: 'HTML', lang: 'html', content: rendered }] } : rendered

    return result
  } else {
    throw new UiengineInputError(`The "${ext}" adapter does not support rendering.`)
  }
}

async function filesForComponent (state, ext, componentName) {
  const { filesForComponent } = getModule(state, ext)
  const options = getOptions(state, ext)
  const fnExists = typeof filesForComponent === 'function'

  if (fnExists && !options.skipScaffold) {
    const files = await filesForComponent(componentName)

    return files
  } else {
    return []
  }
}

async function filesForVariant (state, ext, componentName, variantName) {
  const { filesForVariant } = getModule(state, ext)
  const options = getOptions(state, ext)
  const fnExists = typeof filesForVariant === 'function'

  if (fnExists && !options.skipScaffold) {
    const files = await filesForVariant(componentName, variantName)

    return files
  } else {
    return []
  }
}

module.exports = {
  setup,
  render,
  registerComponentFile,
  filesForComponent,
  filesForVariant
}
