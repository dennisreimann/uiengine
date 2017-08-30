const path = require('path')
const StringUtil = require('./string')

const VARIANTS_DIRNAME = 'variants'

const componentIdToVariantsPath = (componentsPath, componentId) =>
  path.join(componentsPath, componentId, VARIANTS_DIRNAME)

const variantIdToTitle = (id) => {
  const basename = path.basename(id, path.extname(id))
  const title = StringUtil.titleize(basename)

  return title
}

const variantFilePathToComponentId = (componentsPath, variantFilePath) => {
  const relativePath = path.relative(componentsPath, variantFilePath)

  if (relativePath.match(`/${VARIANTS_DIRNAME}/`)) {
    const dirname = path.dirname(relativePath).split(path.sep)[0]
    return dirname
  } else {
    return null
  }
}

const variantIdToComponentId = (id) => {
  const componentId = path.dirname(id).split(path.sep)[0]

  return componentId
}

const variantIdToVariantFilePath = (componentsPath, id) => {
  const componentId = variantIdToComponentId(id)
  const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
  const variantFileName = path.basename(id)
  const variantFile = path.join(variantsPath, variantFileName)

  return variantFile
}

const variantFilePathToVariantId = (componentsPath, variantFilePath) => {
  const componentId = variantFilePathToComponentId(componentsPath, variantFilePath)

  if (componentId) {
    const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
    const relativePath = path.relative(variantsPath, variantFilePath)
    const basename = path.basename(relativePath)
    const variantId = `${componentId}/${basename}`

    return variantId
  } else {
    return null
  }
}

module.exports = {
  componentIdToVariantsPath,
  variantFilePathToComponentId,
  variantIdToComponentId,
  variantIdToTitle,
  variantIdToVariantFilePath,
  variantFilePathToVariantId,
  VARIANTS_DIRNAME
}
