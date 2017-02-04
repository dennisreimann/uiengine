const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const ComponentUtil = require('./util/component')
const VariationUtil = require('./util/variation')

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
  const { attributes, body } = await frontmatter.fromFile(filePath)
  const content = await markdown.fromString(body)

  return { attributes, content }
}

async function findComponentIds (componentsPath, componentGlob = '**') {
  const pathGlob = path.resolve(componentsPath, componentGlob, ComponentUtil.COMPONENT_FILENAME)
  const componentPaths = await glob(pathGlob)
  const componentIdFromComponentFilePath = R.partial(ComponentUtil.componentFilePathToComponentId, [componentsPath])
  const componentIds = R.map(componentIdFromComponentFilePath, componentPaths)

  return componentIds
}

async function findVariationIds (componentsPath, componentId, variationGlob = '*') {
  const variationsPath = VariationUtil.componentIdToVariationsPath(componentsPath, componentId)
  const pathGlob = path.join(variationsPath, variationGlob)
  const variationPaths = await glob(pathGlob)
  const variationIdFromVariationFilePath = R.partial(VariationUtil.variationIdFromVariationFilePath, [componentsPath])
  const variationIds = R.map(variationIdFromVariationFilePath, variationPaths)

  return variationIds
}

async function fetchAll (state) {
  const componentsPath = state.config.source.components
  if (!componentsPath) return {}
  const componentIds = await findComponentIds(componentsPath)

  const componentFetch = R.partial(fetchById, [state])
  const componentFetches = R.map(componentFetch, componentIds)
  const componentList = await Promise.all(componentFetches)

  const components = R.reduce(assocComponent, {}, componentList)

  return components
}

async function fetchById (state, id) {
  const componentsPath = state.config.source.components
  const componentPath = ComponentUtil.componentIdToPath(componentsPath, id)
  const componentFilePath = ComponentUtil.componentIdToComponentFilePath(componentsPath, id)
  const fetchVariationIds = findVariationIds(componentsPath, id)
  const fetchComponentData = readComponentFile(componentFilePath)
  const [ componentData, variationIds ] = await Promise.all([fetchComponentData, fetchVariationIds])

  let { attributes, content } = componentData
  attributes = convertUserProvidedVariationsList(id, attributes)
  const baseData = { id, path: componentPath, variationIds, content }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
