const path = require('path') // dont spread import because of "resolve" ambiguity
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')
const { getBuildId } = require('./util')
const cache = require('./cache')

function extractDependencyFiles (options, filePath) {
  // expect build result to be in cache, as registerFileComponent should
  // alwas have been run before and cache should be prefilled with result.
  const buildId = getBuildId(options)
  const cached = cache.get(buildId, filePath)

  if (!cached.dependencyFiles) {
    // https://webpack.js.org/api/stats#chunk-objects
    const { chunk } = cached
    cached.dependencyFiles = chunk ? chunk.modules.map(({ id, name }) => {
      const ident = typeof id === 'number' ? (name.match(/\s([^\s]*)/g) || ['']).shift().trim() : id
      const mod = ident && ident.split('?!').pop().replace(/\?.*$/, '')
      let modulePath
      if (mod) modulePath = mod.startsWith('.') ? path.resolve(mod) : require.resolve(mod)
      return modulePath && crossPlatformPath(modulePath)
    }).filter((depPath, index, array) => {
      if (!depPath) return false
      const unique = array.indexOf(depPath) === index
      const notSameFile = depPath !== filePath
      return unique && notSameFile
    }) : []
  }

  return cached.dependencyFiles
}

function extractDependentFiles (options, filePath) {
  // expect build result to be in cache, as registerFileComponent should
  // alwas have been run before and cache should be prefilled with result.
  const buildId = getBuildId(options)
  const cached = cache.get(buildId, filePath)

  if (!cached.dependentFiles) {
    const all = cache.all(buildId)
    cached.dependentFiles = all.reduce((result, item) => {
      if (item.filePath !== filePath) {
        const { dependencyFiles = [] } = cache.get(buildId, item.filePath)
        if (dependencyFiles.includes(filePath)) result.push(item.filePath)
      }
      return result
    }, [])
  }

  return cached.dependentFiles
}

module.exports = {
  extractDependencyFiles,
  extractDependentFiles
}
