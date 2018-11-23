const { join, basename, relative } = require('path')
const { crossPlatformPath, titleize } = require('./string')

const entityIdToTitle = id => {
  const base = basename(id)
  const title = titleize(base)

  return title
}

const entityIdToFilePath = (path, id) => {
  const absolutePath = join(path, `${id}.js`)

  return absolutePath
}

const entityFilePathToId = (path, filePath) => {
  const relativePath = relative(path, filePath)

  // invalid path: this is not an entity
  if (relativePath.startsWith('..')) return null

  const id = crossPlatformPath(basename(relativePath, '.js'))

  return id
}

module.exports = {
  entityIdToTitle,
  entityIdToFilePath,
  entityFilePathToId
}
