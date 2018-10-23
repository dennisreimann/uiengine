const { dirname, join, relative, sep } = require('path')
const { titleize } = require('./string')
const { exists, isDirectory } = require('./file')

const COMPONENT_FILENAME = 'component.md'

const componentIdToTitle = (componentId) =>
  titleize(componentId)

const componentIdToFilePath = (componentPaths, componentId, fileName = COMPONENT_FILENAME) => {
  const componentPath = componentPaths.find(componentPath => exists(join(componentPath, componentId)))

  return join(componentPath, componentId, fileName)
}

const componentFilePathToId = (componentPaths, componentFilePath) => {
  const relativePath = componentPathToId(componentPaths, componentFilePath)

  if (relativePath) {
    const dir = dirname(relativePath).split(sep)[0]

    if (dir === '.') {
      return isDirectory(componentFilePath) ? relativePath : undefined
    } else {
      return dir
    }
  }

  return undefined
}

const componentPathToId = (componentPaths, componentPath) => {
  const relativePaths = componentPaths.map(basePath => relative(basePath, componentPath))

  // paths starting with '..' are invalid: not a file/dir in the base dir
  return relativePaths.find(relPath => !relPath.startsWith('..') && relPath.length > 0)
}

module.exports = {
  COMPONENT_FILENAME,
  componentIdToTitle,
  componentIdToFilePath,
  componentFilePathToId,
  componentPathToId
}
