const { join, resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const {
  EntityUtil: { entityIdToFilePath, entityFilePathToId },
  FileUtil: { requireUncached },
  DebugUtil: { debug2, debug3 }
} = require('@uiengine/util')

async function findEntityIds (state, entitiesPath = join('**', '*.js')) {
  const { entities } = state.config.source
  if (!entities) return []

  const pattern = resolve(entities, entitiesPath)
  const paths = await glob(pattern)

  const entityIdFromEntityFilePath = R.partial(entityFilePathToId, [entities])
  const entityIds = R.map(entityIdFromEntityFilePath, paths)

  return entityIds
}

async function fetchAll (state) {
  debug2(state, 'Entity.fetchAll():start')

  const entityIds = await findEntityIds(state)

  const fetch = R.partial(fetchById, [state])
  const fetches = R.map(fetch, entityIds)
  const list = await Promise.all(fetches)

  const entities = R.reduce((all, entities) => {
    const entityId = entityIds[Object.keys(all).length]
    return R.assoc(entityId, entities, all)
  }, {}, list)

  debug2(state, 'Entity.fetchAll():end')

  return entities
}

async function fetchById (state, id) {
  debug3(state, `Entity.fetchById(${id}):start`)

  const { entities } = state.config.source
  const absolutePath = entityIdToFilePath(entities, id)
  const data = requireUncached(absolutePath)

  debug3(state, `Entity.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
