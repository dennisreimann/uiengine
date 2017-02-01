const path = require('path')
const glob = require('globby')

const VARIATIONS_DIRNAME = 'variations'

const componentIdToVariationsPath = (componentsPath, componentId) => path.join(componentsPath, componentId, VARIATIONS_DIRNAME)

const componentIdFromVariationFilePath = (componentsPath, variationFilePath) => {
  const relativePath = path.relative(componentsPath, variationFilePath)
  const dirname = path.dirname(relativePath).split(path.sep)[0]

  return dirname
}

const componentIdFromVariationId = (variationId) => {
  const componentId = path.dirname(variationId).split(path.sep)[0]

  return componentId
}

const variationIdToVariationFilePath = (componentsPath, variationId) => {
  const componentId = componentIdFromVariationId(variationId)
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const variationFileBasename = path.basename(variationId)
  const variationFileGlob = path.join(variationsPath, `${variationFileBasename}.*`)
  const variationFile = glob.sync(variationFileGlob)[0]

  return variationFile
}

const variationIdFromVariationFilePath = (componentsPath, variationFilePath) => {
  const componentId = componentIdFromVariationFilePath(componentsPath, variationFilePath)
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const relativePath = path.relative(variationsPath, variationFilePath)
  const basename = path.basename(relativePath, path.extname(relativePath))
  const variationId = `${componentId}/${basename}`

  return variationId
}

module.exports = {
  componentIdToVariationsPath,
  componentIdFromVariationFilePath,
  componentIdFromVariationId,
  variationIdToVariationFilePath,
  variationIdFromVariationFilePath,
  VARIATIONS_DIRNAME
}
