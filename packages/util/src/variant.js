const { basename, dirname, extname, join, relative, sep } = require('path')
const { titleize } = require('./string')
const { componentIdToFilePath, componentFilePathToId } = require('./component')

const VARIANTS_DIRNAME = 'variants'

const componentIdToVariantsPath = (componentPaths, componentId) =>
  componentIdToFilePath(componentPaths, componentId, VARIANTS_DIRNAME)

const variantIdToComponentId = id =>
  dirname(id).split(sep)[0]

const variantIdToTitle = id => {
  const base = basename(id, extname(id))
  return titleize(base)
}

const variantFilePathToComponentId = (componentPaths, variantFilePath) => {
  const componentId = componentFilePathToId(componentPaths, variantFilePath)

  return variantFilePath.match(`/${VARIANTS_DIRNAME}/`) && componentId
}

const variantIdToFilePath = (componentPaths, id) => {
  const componentId = variantIdToComponentId(id)
  const variantsPath = componentIdToVariantsPath(componentPaths, componentId)
  const variantFileName = basename(id).replace(/(-\d+)$/, '')
  const variantFile = join(variantsPath, variantFileName)

  return variantFile
}

const variantFilePathToIdPrefix = (componentPaths, variantFilePath) => {
  const componentId = variantFilePathToComponentId(componentPaths, variantFilePath)

  if (!componentId) return

  const variantsPath = componentIdToVariantsPath(componentPaths, componentId)
  const relativePath = relative(variantsPath, variantFilePath)
  const base = basename(relativePath)
  const variantIdPrefix = `${componentId}/${base}`

  return variantIdPrefix
}

module.exports = {
  VARIANTS_DIRNAME,
  componentIdToVariantsPath,
  variantIdToComponentId,
  variantIdToTitle,
  variantFilePathToComponentId,
  variantIdToFilePath,
  variantFilePathToIdPrefix
}
