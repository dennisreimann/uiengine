const path = require('path')
const StringUtil = require('./string')

const VARIATIONS_DIRNAME = 'variations'

const componentIdToVariationsPath = (componentsPath, componentId) => path.join(componentsPath, componentId, VARIATIONS_DIRNAME)

const variationIdToTitle = (id) => {
  const basename = path.basename(id, path.extname(id))
  const title = StringUtil.titleize(basename)

  return title
}

const componentIdFromVariationFilePath = (componentsPath, variationFilePath) => {
  const relativePath = path.relative(componentsPath, variationFilePath)
  const dirname = path.dirname(relativePath).split(path.sep)[0]

  return dirname
}

const componentIdFromVariationId = (id) => {
  const componentId = path.dirname(id).split(path.sep)[0]

  return componentId
}

const variationIdToVariationFilePath = (componentsPath, id) => {
  const componentId = componentIdFromVariationId(id)
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const variationFileName = path.basename(id)
  const variationFile = path.join(variationsPath, variationFileName)

  return variationFile
}

const variationIdFromVariationFilePath = (componentsPath, variationFilePath) => {
  const componentId = componentIdFromVariationFilePath(componentsPath, variationFilePath)
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const relativePath = path.relative(variationsPath, variationFilePath)
  const basename = path.basename(relativePath)
  const variationId = `${componentId}/${basename}`

  return variationId
}

module.exports = {
  componentIdToVariationsPath,
  componentIdFromVariationFilePath,
  componentIdFromVariationId,
  variationIdToTitle,
  variationIdToVariationFilePath,
  variationIdFromVariationFilePath,
  VARIATIONS_DIRNAME
}
