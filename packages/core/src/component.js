const { dirname, relative, resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const { registerComponentFile } = require('./connector')
const Variant = require('./variant')
const {
  FrontmatterUtil,
  MarkdownUtil,
  ComponentUtil: { componentFilePathToId, componentIdToFilePath, componentIdToTitle, componentPathToId },
  TemplateUtil: { templateFilePathToId },
  StringUtil: { titleFromContentHeading },
  DebugUtil: { debug2, debug3, debug4, debug5 }
} = require('@uiengine/util')

async function readComponentFile (state, filePath) {
  debug4(state, `Component.readComponentFile(${filePath}):start`)

  const { source } = state.config
  let data = { attributes: {}, hasComponentFile: false } // in case there is no component file

  try {
    const component = await FrontmatterUtil.fromFile(filePath, source)
    const { attributes, body } = component
    const content = await MarkdownUtil.fromString(body)

    data = { attributes, content, hasComponentFile: true }
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
  const pattern = componentIdToFilePath(components, id, `*.{${exts}}`)
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

  const patterns = components.map(componentPath => resolve(componentPath, '**'))
  const componentPaths = await glob(patterns, { onlyDirectories: true, deep: false })
  const componentIdFromComponentPath = R.partial(componentPathToId, [components])
  const componentIds = R.map(componentIdFromComponentPath, componentPaths)

  return componentIds
}

async function fetchAll (state) {
  debug2(state, `Component.fetchAll():start`)

  const componentIds = await findComponentIds(state)
  const fetch = R.partial(fetchById, [state])
  const fetches = R.map(fetch, componentIds)
  const list = await Promise.all(fetches)
  const components = R.reduce((components, component) => R.assoc(component.id, component, components), {}, list)

  debug2(state, `Component.fetchAll():end`)

  return components
}

async function fetchById (state, id) {
  debug3(state, `Component.fetchById(${id}):start`)

  const { base, components, templates } = state.config.source
  if (!components) return null

  const componentFilePath = componentIdToFilePath(components, id)
  const [componentData, fileRegistrations] = await Promise.all([
    readComponentFile(state, componentFilePath),
    registerComponentFiles(state, id)
  ])

  let { attributes, content, attributes: { context, variants }, hasComponentFile } = componentData
  variants = await Variant.fetchObjects(state, id, context, variants)

  const componentFile = relative(base, componentFilePath)
  const sourcePath = dirname(componentFile)
  const sourceFile = hasComponentFile ? componentFile : undefined
  const title = attributes.title || titleFromContentHeading(content) || componentIdToTitle(id)
  const baseData = { id, title, content, variants, sourcePath, sourceFile, type: 'component' }
  const fileData = R.reduce(R.mergeDeepLeft, attributes, R.pluck('data', fileRegistrations))

  // resolve dependencies and dependents
  const filePathToComponentId = R.partial(componentFilePathToId, [components])
  const filePathToTemplateId = R.partial(templateFilePathToId, [templates])
  const resolveComponents = filePaths => filePaths && R.reject(R.isNil, R.uniq(R.map(filePathToComponentId, filePaths)))
  const resolveTemplates = filePaths => filePaths && R.reject(R.isNil, R.uniq(R.map(filePathToTemplateId, filePaths)))
  const dependencies = resolveComponents(fileData.dependencyFiles)
  const dependentComponents = resolveComponents(fileData.dependentFiles)
  const dependentTemplates = resolveTemplates(fileData.dependentFiles)
  if (dependentTemplates && dependentTemplates.length) fileData.dependentTemplates = dependentTemplates
  if (dependentComponents && dependentComponents.length) fileData.dependentComponents = dependentComponents
  if (dependencies && dependencies.length) fileData.dependencies = dependencies

  const data = R.mergeDeepLeft(baseData, fileData)

  debug3(state, `Component.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
