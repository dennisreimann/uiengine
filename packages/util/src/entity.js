const { join, basename, relative } = require('path')
const StringUtil = require('./string')

const entityIdToTitle = id => {
  const base = basename(id)
  const title = StringUtil.titleize(base)

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

  const id = basename(relativePath, '.js')

  return id
}

module.exports = {
  entityIdToTitle,
  entityIdToFilePath,
  entityFilePathToId
}
