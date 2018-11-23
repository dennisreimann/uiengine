const { basename, dirname, join, relative } = require('path')
const { crossPlatformPath } = require('./string')

const templateFilePathToId = (templatesPath, templateFilePath) => {
  if (!crossPlatformPath(templateFilePath).startsWith(crossPlatformPath(templatesPath))) return null

  const relativePath = relative(templatesPath, templateFilePath)
  const dir = dirname(relativePath)
  const name = basename(relativePath)
  const id = crossPlatformPath(join(dir, name))

  return id
}

module.exports = {
  templateFilePathToId
}
