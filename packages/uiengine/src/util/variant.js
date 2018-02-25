const { basename, dirname, extname, join, relative, sep } = require('path')
const StringUtil = require('./string')

const VARIANTS_DIRNAME = 'variants'

const componentIdToVariantsPath = (componentsPath, componentId) =>
  join(componentsPath, componentId, VARIANTS_DIRNAME)

const variantIdToComponentId = id =>
  dirname(id).split(sep)[0]

const variantIdToTitle = id => {
  const base = basename(id, extname(id))
  return StringUtil.titleize(base)
}

const variantFilePathToComponentId = (componentsPath, variantFilePath) => {
  const relativePath = relative(componentsPath, variantFilePath)

  return relativePath.match(`/${VARIANTS_DIRNAME}/`)
    ? dirname(relativePath).split(sep)[0]
    : null
}

const variantIdToVariantFilePath = (componentsPath, id) => {
  const componentId = variantIdToComponentId(id)
  const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
  const variantFileName = basename(id)
  const variantFile = join(variantsPath, variantFileName)

  return variantFile
}

const variantFilePathToVariantId = (componentsPath, variantFilePath) => {
  const componentId = variantFilePathToComponentId(componentsPath, variantFilePath)

  if (componentId) {
    const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
    const relativePath = relative(variantsPath, variantFilePath)
    const base = basename(relativePath)
    const variantId = `${componentId}/${base}`

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
