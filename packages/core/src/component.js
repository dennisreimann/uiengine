const { resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const { registerComponentFile } = require('./connector')
const Variant = require('./variant')
const {
  ComponentUtil,
  FrontmatterUtil,
  MarkdownUtil,
  StringUtil,
  DebugUtil: { debug2, debug3, debug4, debug5 }
} = require('@uiengine/util')

async function readComponentFile (state, filePath) {
  debug4(state, `Component.readComponentFile(${filePath}):start`)

  const { source } = state.config
  let data = { attributes: {} } // in case there is no component file

  try {
    const component = await FrontmatterUtil.fromFile(filePath, source)
    const { attributes, body } = component
    const content = await MarkdownUtil.fromString(body)

    data = { attributes, content }
  } catch (err) {
    debug5(state, 'Could not read component file', filePath, err)
  }

  debug4(state, `Component.readComponentFile(${filePath}):end`)

  return data
}

async function registerComponentFiles (state, id) {
  debug4(state, `Component.registerComponentFiles(${id}):start`)

  // register only files with adapter extensions
  // in the component folder root. No variants!
  const { config: { adapters, source: { components } } } = state
  const exts = Object.keys(adapters).join(',')
  const pattern = ComponentUtil.componentIdToComponentFilePath(components, id, `*.{${exts}}`)
  const paths = await glob(pattern, { onlyFiles: true })

  const register = R.partial(registerComponentFile, [state])
  const registers = R.map(register, paths)
  const registrations = await Promise.all(registers)

  debug4(state, `Component.registerComponentFiles(${id}):end`)

  return R.reject(R.isNil, registrations)
}

async function findComponentIds (state) {
  const { components } = state.config.source
  if (!components) return []

  const pattern = resolve(components, '**')
  const componentPaths = await glob(pattern, { onlyDirectories: true, deep: false })
  const componentIdFromComponentPath = R.partial(ComponentUtil.componentPathToComponentId, [components])
  const componentIds = R.map(componentIdFromComponentPath, componentPaths)

  return componentIds
}

export async function fetchAll (state) {
  debug2(state, `Component.fetchAll():start`)

  const componentIds = await findComponentIds(state)
  const fetch = R.partial(fetchById, [state])
  const fetches = R.map(fetch, componentIds)
  const list = await Promise.all(fetches)
  const components = R.reduce((components, component) => R.assoc(component.id, component, components), {}, list)

  debug2(state, `Component.fetchAll():end`)

  return components
}

export async function fetchById (state, id) {
  debug3(state, `Component.fetchById(${id}):start`)

  const { components } = state.config.source
  if (!components) return null

  const componentPath = ComponentUtil.componentIdToPath(id)
  const componentFilePath = ComponentUtil.componentIdToComponentFilePath(components, id)
  const [componentData, fileRegistrations] = await Promise.all([
    readComponentFile(state, componentFilePath),
    registerComponentFiles(state, id)
  ])

  let { attributes, content, attributes: { context, variants } } = componentData
  variants = await Variant.fetchObjects(state, id, context, variants)

  const title = attributes.title || StringUtil.titleFromContentHeading(content) || ComponentUtil.componentIdToTitle(id)
  const baseData = { id, title, content, variants, path: componentPath, type: 'component' }
  const fileData = R.reduce(R.mergeDeepLeft, attributes, R.pluck('data', fileRegistrations))
  const data = R.mergeDeepLeft(baseData, fileData)

  debug3(state, `Component.fetchById(${id}):end`)

  return data
}
