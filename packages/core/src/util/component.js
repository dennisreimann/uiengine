const { dirname, join, relative, sep } = require('path')
const StringUtil = require('./string')

const COMPONENT_FILENAME = 'component.md'
const COMPONENTS_DIRNAME = 'components'

const componentIdToTitle = (componentId) =>
  StringUtil.titleize(componentId)

const componentIdToPath = (componentId) =>
  join(COMPONENTS_DIRNAME, componentId)

const componentIdToComponentFilePath = (componentsPath, componentId) =>
  join(componentsPath, componentId, COMPONENT_FILENAME)

const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = relative(componentsPath, componentFilePath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  const dir = dirname(relativePath).split(sep)[0]

  return dir
}

const componentPathToComponentId = (componentsPath, componentPath) => {
  const relativePath = relative(componentsPath, componentPath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  return relativePath
}

module.exports = {
  componentIdToTitle,
  componentIdToPath,
  componentIdToComponentFilePath,
  componentFilePathToComponentId,
  componentPathToComponentId,
  COMPONENT_FILENAME,
  COMPONENTS_DIRNAME
}
