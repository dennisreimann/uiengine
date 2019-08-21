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

const getOptions = (state, ext, additional = {}) => {
  const { config: { adapters, target, themes, source: { base, components, templates }, ui: { base: uiBase } } } = state
  const themeIds = themes.map(theme => theme.id)
  const { options } = adapters[ext]

  return Object.assign({}, options, additional, { ext, base, components, templates, target, themeIds, uiBase })
}

async function setup (state) {
  debug3(state, 'Connector.setup():start')

  const { config: { adapters } } = state
  const exts = Object.keys(adapters || {})
  const tasks = []

  exts.map(ext => {
    const { setup: setupFn } = getModule(state, ext)

    if (typeof setupFn === 'function') {
      const options = getOptions(state, ext)
      tasks.push(setupFn(options))
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
    const { registerComponentFile: registerFn } = getModule(state, ext, filePath)

    if (typeof registerFn === 'function') {
      const options = getOptions(state, ext)
      const data = await registerFn(options, filePath)

      if (data) {
        const id = componentFilePathToId(components, filePath)

        return { id, filePath, data }
      }
    }
  }
}

async function render (state, templatePath, data = {}, themeId, identifier) {
  const ext = extension(templatePath)
  const { render: renderFn } = getModule(state, ext, templatePath)

  if (typeof renderFn === 'function') {
    const options = getOptions(state, ext, { themeId })
    const renderId = `${themeId}/${identifier}`
    const rendered = await renderFn(options, templatePath, data, renderId)

    return typeof rendered === 'string' ? { rendered } : rendered
  } else {
    throw new UiengineInputError(`The "${ext}" adapter does not support rendering.`)
  }
}

async function filesForComponent (state, ext, componentName) {
  const { filesForComponent: filesFn } = getModule(state, ext)
  const options = getOptions(state, ext)
  const fnExists = typeof filesFn === 'function'

  if (fnExists && !options.skipScaffold) {
    const files = await filesFn(options, componentName)

    return files
  } else {
    return []
  }
}

async function filesForVariant (state, ext, componentName, variantName) {
  const { filesForVariant: filesFn } = getModule(state, ext)
  const options = getOptions(state, ext)
  const fnExists = typeof filesFn === 'function'

  if (fnExists && !options.skipScaffold) {
    const files = await filesFn(options, componentName, variantName)

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
