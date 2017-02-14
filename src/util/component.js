const path = require('path')

const COMPONENT_FILENAME = 'component.md'

const componentIdToPath = (componentsPath, componentId) => path.join(componentsPath, componentId)

const componentIdToComponentFilePath = (componentsPath, componentId) => path.join(componentsPath, componentId, COMPONENT_FILENAME)

const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = path.relative(componentsPath, componentFilePath)

  // invalid path: this is not a component
  if (relativePath.startsWith('..')) return null

  const dirname = path.dirname(relativePath).split(path.sep)[0]

  return dirname
}

module.exports = {
  componentIdToPath,
  componentIdToComponentFilePath,
  componentFilePathToComponentId,
  COMPONENT_FILENAME
}
