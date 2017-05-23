const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const ComponentUtil = require('./util/component')
const Variant = require('./variant')
const { debug2, debug3, debug4 } = require('./util/debug')

const assocComponent = (components, component) =>
  R.assoc(component.id, component, components)

// turns the list of variants from the user provided attributes
// into a list of correctly named variantIds
const convertUserProvidedVariantsList = (componentId, attributes = {}) => {
  let { variants } = attributes
  if (typeof variants !== 'object') return attributes

  const variantIds = R.map((variantId) =>
    variantId.startsWith(`${componentId}/`) ? variantId : `${componentId}/${variantId}`,
    variants
  )

  attributes = R.dissoc('variants', attributes)
  attributes = R.assoc('variantIds', variantIds, attributes)

  return attributes
}

async function readComponentFile (state, filePath) {
  debug4(state, `Component.readComponentFile(${filePath}):start`)

  const { source } = state.config
  const component = await frontmatter.fromFile(filePath, source)
  let data = { attributes: {} } // in case there is no component file

  if (component) {
    const { attributes, body } = component
    const content = await markdown.fromString(body)

    data = { attributes, content }
  }

  debug4(state, `Component.readComponentFile(${filePath}):end`)

  return data
}

async function findComponentIds (state) {
  const { components } = state.config.source
  if (!components) return []

  const pattern = path.resolve(components, '*')
  const componentPaths = await glob(pattern)
  const componentIdFromComponentPath = R.partial(ComponentUtil.componentPathToComponentId, [components])
  const componentIds = R.map(componentIdFromComponentPath, componentPaths)

  return componentIds
}

async function fetchAll (state) {
  debug2(state, `Component.fetchAll():start`)

  const componentIds = await findComponentIds(state)

  const componentFetch = R.partial(fetchById, [state])
  const componentFetches = R.map(componentFetch, componentIds)
  const componentList = await Promise.all(componentFetches)

  const components = R.reduce(assocComponent, {}, componentList)

  debug2(state, `Component.fetchAll():end`)

  return components
}

async function fetchById (state, id) {
  debug3(state, `Component.fetchById(${id}):start`)

  const componentsPath = state.config.source.components
  const componentPath = ComponentUtil.componentIdToPath(id)
  const componentFilePath = ComponentUtil.componentIdToComponentFilePath(componentsPath, id)
  const fetchVariantIds = Variant.findVariantIds(state, id)
  const fetchComponentData = readComponentFile(state, componentFilePath)
  const [ componentData, variantIds ] = await Promise.all([fetchComponentData, fetchVariantIds])

  let { attributes, content } = componentData
  attributes = convertUserProvidedVariantsList(id, attributes)
  const title = ComponentUtil.componentIdToTitle(id)
  const baseData = { id, title, path: componentPath, variantIds, content }
  const data = R.mergeAll([baseData, attributes])

  debug3(state, `Component.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
