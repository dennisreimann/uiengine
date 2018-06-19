const { join } = require('path')
const R = require('ramda')
const glob = require('globby')
const File = require('./util/file')
const ComponentUtil = require('./util/component')
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

const getOptions = (state, ext) => {
  const { config: { adapters, target, source: { components, templates } } } = state
  const { options } = adapters[ext]

  return Object.assign({}, options, { ext, components, templates, target })
}

export async function setup (state) {
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

export async function registerComponentFile (state, filePath) {
  const { config: { adapters, source: { components } } } = state
  const ext = File.extension(filePath)
  const adapter = adapters[ext]

  if (adapter) {
    const { registerComponentFile } = getModule(state, ext, filePath)

    if (typeof registerComponentFile === 'function') {
      const options = getOptions(state, ext)
      const data = await registerComponentFile(options, filePath)

      if (data) {
        const id = ComponentUtil.componentFilePathToComponentId(components, filePath)

        return { id, filePath, data }
      }
    }
  }
}

export async function render (state, templatePath, data = {}) {
  const ext = File.extension(templatePath)
  const { render } = getModule(state, ext, templatePath)

  if (typeof render === 'function') {
    const options = getOptions(state, ext)
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
