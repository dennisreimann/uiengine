const { dirname, join, relative, sep } = require('path')
const StringUtil = require('./string')

const COMPONENT_FILENAME = 'component.md'
const COMPONENTS_DIRNAME = 'components'

const componentIdToTitle = (componentId) =>
  StringUtil.titleize(componentId)

const componentIdToPath = (componentId) =>
  join(COMPONENTS_DIRNAME, componentId)

const componentIdToFilePath = (componentsPath, componentId, fileName = COMPONENT_FILENAME) =>
  join(componentsPath, componentId, fileName)

const componentFilePathToId = (componentsPath, componentFilePath) => {
  const relativePath = relative(componentsPath, componentFilePath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  const dir = dirname(relativePath).split(sep)[0]

  return dir
}

const componentPathToId = (componentsPath, componentPath) => {
  const relativePath = relative(componentsPath, componentPath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  return relativePath
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
