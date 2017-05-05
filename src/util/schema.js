const path = require('path')
const StringUtil = require('./string')

const schemaIdToTitle = (schemaId) => {
  const basename = path.basename(schemaId)
  const title = StringUtil.titleize(basename)

  return title
}

const schemaIdToSchemaFilePath = (schemasPath, schemaId) => {
  const absolutePath = path.join(schemasPath, `${schemaId}.yml`)

  return absolutePath
}

const schemaFilePathToSchemaId = (schemasPath, schemaFilePath) => {
  const relativePath = path.relative(schemasPath, schemaFilePath)

  // invalid path: this is not a schema
  if (relativePath.startsWith('..')) return null

  const schemaId = path.basename(relativePath, '.yml')

  return schemaId
}

module.exports = {
  schemaIdToTitle,
  schemaIdToSchemaFilePath,
  schemaFilePathToSchemaId
}
