const { basename, dirname, extname, join, relative, sep } = require('path')
const StringUtil = require('./string')

export const VARIANTS_DIRNAME = 'variants'

export const componentIdToVariantsPath = (componentsPath, componentId) =>
  join(componentsPath, componentId, VARIANTS_DIRNAME)

export const variantIdToComponentId = id =>
  dirname(id).split(sep)[0]

export const variantIdToTitle = id => {
  const base = basename(id, extname(id))
  return StringUtil.titleize(base)
}

export const variantFilePathToComponentId = (componentsPath, variantFilePath) => {
  const relativePath = relative(componentsPath, variantFilePath)

  return relativePath.match(`/${VARIANTS_DIRNAME}/`)
    ? dirname(relativePath).split(sep)[0]
    : null
}

export const variantIdToFilePath = (componentsPath, id) => {
  const componentId = variantIdToComponentId(id)
  const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
  const variantFileName = basename(id).replace(/(-\d+)$/, '')
  const variantFile = join(variantsPath, variantFileName)

  return variantFile
}

export const variantFilePathToIdPrefix = (componentsPath, variantFilePath) => {
  const componentId = variantFilePathToComponentId(componentsPath, variantFilePath)

  if (componentId) {
    const variantsPath = componentIdToVariantsPath(componentsPath, componentId)
    const relativePath = relative(variantsPath, variantFilePath)
    const base = basename(relativePath)
    const variantIdPrefix = `${componentId}/${base}`

    return variantIdPrefix
  } else {
    return null
  }
}
