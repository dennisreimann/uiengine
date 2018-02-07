const { basename, dirname, extname, join, relative, sep } = require('path')
const StringUtil = require('./string')

const VARIANTS_DIRNAME = 'variants'

const componentIdToVariantsPath = (componentsPath, componentId) =>
  join(componentsPath, componentId, VARIANTS_DIRNAME)

const variantIdToTitle = (id) => {
  const base = basename(id, extname(id))
  const title = StringUtil.titleize(base)

  return title
}

const variantFilePathToComponentId = (componentsPath, variantFilePath) => {
  const relativePath = relative(componentsPath, variantFilePath)

  if (relativePath.match(`/${VARIANTS_DIRNAME}/`)) {
    const dir = dirname(relativePath).split(sep)[0]
    return dir
  } else {
    return null
  }
}

const variantIdToComponentId = (id) => {
  const componentId = dirname(id).split(sep)[0]

  return componentId
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
