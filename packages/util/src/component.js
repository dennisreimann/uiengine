const { dirname, join, relative } = require('path')
const { crossPlatformPath, titleize } = require('./string')
const { exists, isDirectory } = require('./file')

const COMPONENT_CONFNAME = 'component.config.js'
const COMPONENT_DOCSNAME = 'README.md'

const componentIdToTitle = (componentId) =>
  titleize(componentId)

const componentIdToFilePath = (componentPaths, componentId, fileName = COMPONENT_CONFNAME) => {
  const componentPath = componentPaths.find(componentPath => exists(join(componentPath, componentId)))
  const absolutePath = join(componentPath, componentId, fileName)

  return absolutePath
}

const componentFilePathToId = (componentPaths, componentFilePath) => {
  const relativePath = componentPathToId(componentPaths, componentFilePath)

  if (relativePath) {
    const dir = dirname(relativePath).split('/')[0]

    if (dir === '.') {
      return isDirectory(componentFilePath) ? crossPlatformPath(relativePath) : undefined
    } else {
      return crossPlatformPath(dir)
    }
  }

  return undefined
}

const componentPathToId = (componentPaths, componentPath) => {
  const relativePaths = componentPaths.map(basePath => relative(basePath, componentPath))

  // paths starting with '..' are invalid: not a file/dir in the base dir
  const relativePath = relativePaths.find(relPath => !relPath.startsWith('..') && relPath.length > 0)

  return relativePath ? crossPlatformPath(relativePath) : undefined
}

module.exports = {
  COMPONENT_CONFNAME,
  COMPONENT_DOCSNAME,
  componentIdToTitle,
  componentIdToFilePath,
  componentFilePathToId,
  componentPathToId
}
