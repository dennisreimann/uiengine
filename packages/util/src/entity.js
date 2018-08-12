const { join, basename, relative } = require('path')
const StringUtil = require('./string')

export const entityIdToTitle = id => {
  const base = basename(id)
  const title = StringUtil.titleize(base)

  return title
}

export const entityIdToFilePath = (path, id) => {
  const absolutePath = join(path, `${id}.yml`)

  return absolutePath
}

export const entityFilePathToId = (path, filePath) => {
  const relativePath = relative(path, filePath)

  // invalid path: this is not an entity
  if (relativePath.startsWith('..')) return null

  const id = basename(relativePath, '.yml')

  return id
}
