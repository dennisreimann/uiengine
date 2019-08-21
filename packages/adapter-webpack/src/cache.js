const CACHES = {}

function cacheGet (queueId, filePath, renderId) {
  const id = renderId || filePath
  return CACHES[queueId] && CACHES[queueId][id]
}

function cachePut (queueId, filePath, renderId, object) {
  const id = renderId || filePath
  CACHES[queueId] = CACHES[queueId] || {}
  CACHES[queueId][id] = object
}

function cacheDel (queueId, filePath, renderId) {
  const id = renderId || filePath
  if (CACHES[queueId]) delete CACHES[queueId][id]
}

module.exports = {
  cacheGet,
  cachePut,
  cacheDel
}
