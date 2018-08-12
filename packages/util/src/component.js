const { dirname, join, relative, sep } = require('path')
const { titleize } = require('./string')
const { exists } = require('./file')

const COMPONENT_FILENAME = 'component.md'
const COMPONENTS_DIRNAME = 'components'

const componentIdToTitle = (componentId) =>
  titleize(componentId)

const componentIdToPath = (componentId) =>
  join(COMPONENTS_DIRNAME, componentId)

const componentIdToFilePath = (componentPaths, componentId, fileName = COMPONENT_FILENAME) => {
  const componentPath = componentPaths.find(componentPath => exists(join(componentPath, componentId)))

  return join(componentPath, componentId, fileName)
}

const componentFilePathToId = (componentPaths, componentFilePath) => {
  const relativePath = componentPathToId(componentPaths, componentFilePath)

  return relativePath && dirname(relativePath).split(sep)[0]
}

const componentPathToId = (componentPaths, componentPath) => {
  const relativePaths = componentPaths.map(basePath => relative(basePath, componentPath))

  // paths starting with '..' are invalid: not a file/dir in the base dir
  return relativePaths.find(relPath => !relPath.startsWith('..'))
}

module.exports = {
  COMPONENT_FILENAME,
  COMPONENTS_DIRNAME,
  componentIdToTitle,
  componentIdToPath,
  componentIdToFilePath,
  componentFilePathToId,
  componentPathToId
}
