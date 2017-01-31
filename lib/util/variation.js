const path = require('path')

const VARIATIONS_DIRNAME = 'variations'

const componentIdToVariationsPath = (componentsPath, componentId) => path.join(componentsPath, componentId, VARIATIONS_DIRNAME)

const variationIdFromVariationFilePath = (componentsPath, componentId, variationFilePath) => {
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const relativePath = path.relative(variationsPath, variationFilePath)
  const basename = path.basename(relativePath, path.extname(relativePath))
  const variationId = `${componentId}/${basename}`

  return variationId
}

module.exports = {
  componentIdToVariationsPath,
  variationIdFromVariationFilePath,
  VARIATIONS_DIRNAME
}
