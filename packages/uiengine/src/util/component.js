const path = require('path')
const StringUtil = require('./string')

const COMPONENT_FILENAME = 'component.md'
const COMPONENTS_DIRNAME = 'components'

const componentIdToTitle = (componentId) =>
  StringUtil.titleize(componentId)

const componentIdToPath = (componentId) =>
  path.join(COMPONENTS_DIRNAME, componentId)

const componentIdToComponentFilePath = (componentsPath, componentId) =>
  path.join(componentsPath, componentId, COMPONENT_FILENAME)

const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = path.relative(componentsPath, componentFilePath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  const dirname = path.dirname(relativePath).split(path.sep)[0]

  return dirname
}

const componentPathToComponentId = (componentsPath, componentPath) => {
  const relativePath = path.relative(componentsPath, componentPath)

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
