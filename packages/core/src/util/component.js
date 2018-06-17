const { dirname, join, relative, sep } = require('path')
const StringUtil = require('./string')

export const COMPONENT_FILENAME = 'component.md'
export const COMPONENTS_DIRNAME = 'components'

export const componentIdToTitle = (componentId) =>
  StringUtil.titleize(componentId)

export const componentIdToPath = (componentId) =>
  join(COMPONENTS_DIRNAME, componentId)

export const componentIdToComponentFilePath = (componentsPath, componentId, fileName = COMPONENT_FILENAME) =>
  join(componentsPath, componentId, fileName)

export const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = relative(componentsPath, componentFilePath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  const dir = dirname(relativePath).split(sep)[0]

  return dir
}

export const componentPathToComponentId = (componentsPath, componentPath) => {
  const relativePath = relative(componentsPath, componentPath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  return relativePath
}
