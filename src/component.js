const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const ComponentUtil = require('./util/component')
const Variation = require('./variation')

const assocComponent = (components, component) =>
  R.assoc(component.id, component, components)

// turns the list of variations from the user provided attributes
// into a list of correctly named variationIds
const convertUserProvidedVariationsList = (componentId, attributes = {}) => {
  let { variations } = attributes
  if (typeof variations !== 'object') return attributes

  const variationIds = R.map((variationId) =>
    variationId.startsWith(`${componentId}/`) ? variationId : `${componentId}/${variationId}`,
    variations
  )

  attributes = R.dissoc('variations', attributes)
  attributes = R.assoc('variationIds', variationIds, attributes)

  return attributes
}

async function readComponentFile (filePath) {
  const component = await frontmatter.fromFile(filePath)

  if (component) {
    const { attributes, body } = component
    const content = await markdown.fromString(body)

    return { attributes, content }
  } else {
    // no component file
    return { attributes: {} }
  }
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
  const componentIds = await findComponentIds(state)

  const componentFetch = R.partial(fetchById, [state])
  const componentFetches = R.map(componentFetch, componentIds)
  const componentList = await Promise.all(componentFetches)

  const components = R.reduce(assocComponent, {}, componentList)

  return components
}

async function fetchById (state, id) {
  const componentsPath = state.config.source.components
  const componentPath = ComponentUtil.componentIdToPath(id)
  const componentFilePath = ComponentUtil.componentIdToComponentFilePath(componentsPath, id)
  const fetchVariationIds = Variation.findVariationIds(state, id)
  const fetchComponentData = readComponentFile(componentFilePath)
  const [ componentData, variationIds ] = await Promise.all([fetchComponentData, fetchVariationIds])

  let { attributes, content } = componentData
  attributes = convertUserProvidedVariationsList(id, attributes)
  const title = ComponentUtil.componentIdToTitle(id)
  const baseData = { id, title, path: componentPath, variationIds, content }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
