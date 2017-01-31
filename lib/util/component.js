const path = require('path')

const COMPONENT_FILENAME = 'component.md'
const VARIATIONS_DIRNAME = 'variations'

const componentIdToPath = (componentsPath, componentId) => path.join(componentsPath, componentId)

const componentIdToComponentFilePath = (componentsPath, componentId) => path.join(componentsPath, componentId, COMPONENT_FILENAME)

const componentIdToVariationsPath = (componentsPath, componentId) => path.join(componentsPath, componentId, VARIATIONS_DIRNAME)

const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = path.relative(componentsPath, componentFilePath)
  const dirname = path.dirname(relativePath)

  return dirname
}

const variationIdFromVariationFilePath = (componentsPath, componentId, variationFilePath) => {
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const relativePath = path.relative(variationsPath, variationFilePath)
  const basename = path.basename(relativePath, path.extname(relativePath))
  const variationId = `${componentId}/${basename}`

  return variationId
}

module.exports = {
  componentIdToPath,
  componentIdToComponentFilePath,
  componentFilePathToComponentId,
  componentIdToVariationsPath,
  variationIdFromVariationFilePath,
  COMPONENT_FILENAME,
  VARIATIONS_DIRNAME
}
