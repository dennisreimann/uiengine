const { dirname, join, relative, sep } = require('path')
const { titleize } = require('./string')
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
  COMPONENT_CONFNAME,
  COMPONENT_DOCSNAME,
  componentIdToTitle,
  componentIdToFilePath,
  componentFilePathToId,
  componentPathToId
}
