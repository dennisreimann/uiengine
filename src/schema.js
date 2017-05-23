const path = require('path')
const R = require('ramda')
const glob = require('globby')
const Yaml = require('./util/yaml')
const SchemaUtil = require('./util/schema')
const { debug2, debug3 } = require('./util/debug')

async function findSchemaIds (state, schemaPath = '**/*.yml') {
  const { schema } = state.config.source
  if (!schema) return []

  const pattern = path.resolve(schema, schemaPath)
  const schemaPaths = await glob(pattern)
  const schemaIdFromSchemaFilePath = R.partial(SchemaUtil.schemaFilePathToSchemaId, [schema])
  const schemaIds = R.map(schemaIdFromSchemaFilePath, schemaPaths)

  return schemaIds
}

async function fetchAll (state) {
  debug2(state, 'Schema.fetchAll():start')

  const schemaIds = await findSchemaIds(state)

  const schemaFetch = R.partial(fetchById, [state])
  const schemaFetches = R.map(schemaFetch, schemaIds)
  const schemaList = await Promise.all(schemaFetches)

  const schema = R.reduce((all, schema) => {
    const schemaId = schemaIds[Object.keys(all).length]
    return R.assoc(schemaId, schema, all)
  }, {}, schemaList)

  debug2(state, 'Schema.fetchAll():end')

  return schema
}

async function fetchById (state, id) {
  debug3(state, `Schema.fetchById(${id}):start`)

  const { schema } = state.config.source
  const absolutePath = SchemaUtil.schemaIdToSchemaFilePath(schema, id)
  const data = await Yaml.fromFile(absolutePath)

  debug3(state, `Schema.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
