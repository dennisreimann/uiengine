const CACHES = {}

function cacheGet (queueId, filePath) {
  return CACHES[queueId] && CACHES[queueId][filePath]
}

function cachePut (queueId, filePath, object) {
  CACHES[queueId] = CACHES[queueId] || {}
  CACHES[queueId][filePath] = object
}

function cacheDel (queueId, filePath) {
  if (CACHES[queueId]) delete CACHES[queueId][filePath]
}

module.exports = {
  cacheGet,
  cachePut,
  cacheDel
}
