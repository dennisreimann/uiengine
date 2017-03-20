const path = require('path')
const StringUtil = require('./string')

const VARIATIONS_DIRNAME = 'variations'

const componentIdToVariationsPath = (componentsPath, componentId) =>
  path.join(componentsPath, componentId, VARIATIONS_DIRNAME)

const variationIdToTitle = (id) => {
  const basename = path.basename(id, path.extname(id))
  const title = StringUtil.titleize(basename)

  return title
}

const variationFilePathToComponentId = (componentsPath, variationFilePath) => {
  const relativePath = path.relative(componentsPath, variationFilePath)

  if (relativePath.match(`/${VARIATIONS_DIRNAME}/`)) {
    const dirname = path.dirname(relativePath).split(path.sep)[0]
    return dirname
  } else {
    return null
  }
}

const variationIdToComponentId = (id) => {
  const componentId = path.dirname(id).split(path.sep)[0]

  return componentId
}

const variationIdToVariationFilePath = (componentsPath, id) => {
  const componentId = variationIdToComponentId(id)
  const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
  const variationFileName = path.basename(id)
  const variationFile = path.join(variationsPath, variationFileName)

  return variationFile
}

const variationFilePathToVariationId = (componentsPath, variationFilePath) => {
  const componentId = variationFilePathToComponentId(componentsPath, variationFilePath)

  if (componentId) {
    const variationsPath = componentIdToVariationsPath(componentsPath, componentId)
    const relativePath = path.relative(variationsPath, variationFilePath)
    const basename = path.basename(relativePath)
    const variationId = `${componentId}/${basename}`

    return variationId
  } else {
    return null
  }
}

module.exports = {
  componentIdToVariationsPath,
  variationFilePathToComponentId,
  variationIdToComponentId,
  variationIdToTitle,
  variationIdToVariationFilePath,
  variationFilePathToVariationId,
  VARIATIONS_DIRNAME
}
