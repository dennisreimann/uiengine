const { dirname, join, relative, resolve } = require('path')
const R = require('ramda')
const { registerComponentFile } = require('./connector')
const Variant = require('./variant')
const {
  MarkdownUtil,
  ComponentUtil: { COMPONENT_DOCSNAME, componentFilePathToId, componentIdToFilePath, componentIdToTitle, componentPathToId },
  FileUtil: { exists, glob, requireUncached },
  TemplateUtil: { templateFilePathToId },
  StringUtil: { crossPlatformPath, titleFromContentHeading },
  DebugUtil: { debug2, debug3, debug4 }
} = require('@uiengine/util')

const mergeFn = (a, b) => (R.is(Array, a) && R.is(Array, b)) ? R.concat(a, b) : a

async function readComponentFiles (state, id) {
  debug4(state, `Component.readComponentFiles(${id}):start`)

  const { base, components } = state.config.source
  const configPath = componentIdToFilePath(components, id)
  const dir = dirname(configPath)
  const readmePath = join(dir, COMPONENT_DOCSNAME)
  const sourcePath = crossPlatformPath(relative(base, dir))
  const data = { attributes: {}, sourcePath }

  // config
  if (exists(configPath)) {
    data.attributes = requireUncached(configPath)
    data.sourceFile = crossPlatformPath(relative(base, configPath))
  }

  // readme
  if (exists(readmePath)) {
    data.content = await MarkdownUtil.fromFile(readmePath)
    data.readmeFile = crossPlatformPath(relative(base, readmePath))
  }

  debug4(state, `Component.readComponentFiles(${id}):end`)

  return data
}

async function registerComponentFiles (state, id) {
  debug4(state, `Component.registerComponentFiles(${id}):start`)

  // register only files with adapter extensions
  // in the component folder root. No variants!
  const { config: { adapters, source: { components } } } = state
  const exts = Object.keys(adapters).join(',')
  const pattern = crossPlatformPath(componentIdToFilePath(components, id, `*.{${exts}}`))
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

  const patterns = components.map(componentPath => crossPlatformPath(resolve(componentPath, '**')))
  const componentPaths = await glob(patterns, { onlyDirectories: true, deep: false })
  const componentIdFromComponentPath = R.partial(componentPathToId, [components])
  const componentIds = R.map(componentIdFromComponentPath, componentPaths)

  return componentIds
}

async function refetchVariants (state, id) {
  // in case of a refetch we use the current context and variants
  const { context, variants } = state.components[id]
  return Variant.fetchObjects(state, id, context, variants)
}

async function fetchAll (state) {
  debug2(state, 'Component.fetchAll():start')

  const componentIds = await findComponentIds(state)
  const fetch = R.partial(fetchById, [state])
  const fetches = R.map(fetch, componentIds)
  const list = await Promise.all(fetches)
  const components = R.reduce((components, component) => R.assoc(component.id, component, components), {}, list)

  debug2(state, 'Component.fetchAll():end')

  return components
}

async function fetchById (state, id) {
  debug3(state, `Component.fetchById(${id}):start`)

  const { components, templates } = state.config.source
  if (!components) return null

  const { attributes, content, sourcePath, sourceFile, readmeFile, attributes: { context, variants: variantsObject } } = await readComponentFiles(state, id)

  const [variants, fileRegistrations] = await Promise.all([
    Variant.fetchObjects(state, id, context, variantsObject),
    registerComponentFiles(state, id)
  ])

  let title = attributes.title
  let isTitleFromHeading
  if (!title) {
    const titleFromHeading = titleFromContentHeading(content)
    title = titleFromHeading || componentIdToTitle(id)
    isTitleFromHeading = !!titleFromHeading
  }

  const baseData = { id, title, isTitleFromHeading, content, variants, sourcePath, sourceFile, readmeFile, type: 'component' }
  const fileData = R.reduce(R.mergeDeepWith(mergeFn), attributes, R.pluck('data', fileRegistrations))

  // resolve dependencies and dependents
  const filePathToComponentId = R.partial(componentFilePathToId, [components])
  const filePathToTemplateId = R.partial(templateFilePathToId, [templates])
  const resolveComponents = filePaths => filePaths && R.reject(componentId => (R.isNil(componentId) || componentId === id), R.uniq(R.map(filePathToComponentId, filePaths)))
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
  fetchById,
  refetchVariants
}
