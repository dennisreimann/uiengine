const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const VariationUtil = require('./util/variation')

const assocVariation = (variations, variation) =>
  R.assoc(variation.id, variation, variations)

async function readVariationFile (filePath) {
  const { attributes, body } = await frontmatter.fromFile(filePath)
  const raw = body

  return { attributes, raw }
}

async function findVariationIds (componentsPath, variationGlob = '*') {
  const variationsPath = VariationUtil.componentIdToVariationsPath(componentsPath, '**')
  const pathGlob = path.join(variationsPath, variationGlob)
  const variationPaths = await glob(pathGlob)
  const variationIdFromVariationFilePath = R.partial(VariationUtil.variationIdFromVariationFilePath, [componentsPath])
  const variationIds = R.map(variationIdFromVariationFilePath, variationPaths)

  return variationIds
}

async function fetchAll (state) {
  const componentsPath = state.config.source.components
  if (!componentsPath) return {}
  const variationIds = await findVariationIds(componentsPath)

  const variationFetch = R.partial(fetchById, [state])
  const variationFetches = R.map(variationFetch, variationIds)
  const variationList = await Promise.all(variationFetches)

  const variations = R.reduce(assocVariation, {}, variationList)

  return variations
}

async function fetchById (state, id) {
  const componentsPath = state.config.source.components
  const componentId = VariationUtil.componentIdFromVariationId(id)
  const variationFilePath = VariationUtil.variationIdToVariationFilePath(componentsPath, id)
  const variationData = await readVariationFile(variationFilePath)

  const { attributes, raw } = variationData
  const baseData = { id, componentId, path: variationFilePath, raw }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
