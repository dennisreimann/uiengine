const path = require('path')

const COMPONENT_FILENAME = 'component.md'

const componentIdToPath = (componentsPath, componentId) => path.join(componentsPath, componentId)

const componentIdToComponentFilePath = (componentsPath, componentId) => path.join(componentsPath, componentId, COMPONENT_FILENAME)

const componentFilePathToComponentId = (componentsPath, componentFilePath) => {
  const relativePath = path.relative(componentsPath, componentFilePath)
  const dirname = path.dirname(relativePath)

  return dirname
}

module.exports = {
  componentIdToPath,
  componentIdToComponentFilePath,
  componentFilePathToComponentId,
  COMPONENT_FILENAME
}
