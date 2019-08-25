const CACHES = {}

const all = buildId => Object.values(CACHES[buildId])

const get = (buildId, filePath) => {
  return CACHES[buildId] && CACHES[buildId][filePath]
}

const put = (buildId, filePath, object) => {
  CACHES[buildId] = CACHES[buildId] || {}
  CACHES[buildId][filePath] = object
}

const del = (buildId, filePath) => {
  if (CACHES[buildId]) delete CACHES[buildId][filePath]
}

module.exports = {
  all,
  get,
  put,
  del
}
