const path = require('path') // dont spread import because of "resolve" ambiguity
const glob = require('globby')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')
const { buildQueued } = require('./util')

const DEPENDENCY_CACHE = {}
const EXTENSIONS = ['js', 'jsx', 'ts', 'vue']

// taken from https://stackoverflow.com/a/46842181/183537
async function filter (arr, callback) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

async function getDependencyFiles (options, filePath, cache) {
  if (cache && cache[filePath]) return cache[filePath]

  // cache the promises so that files do not get added multiple times
  const promise = new Promise((resolve, reject) => {
    buildQueued(options, filePath)
      .then(({ serverChunk, clientChunk }) => {
        const chunk = serverChunk || clientChunk

        // https://webpack.js.org/api/stats#chunk-objects
        const filePaths = chunk ? chunk.modules.map(({ id }) => {
          const mod = id.split('?!').pop().replace(/\?.*$/, '')
          let modulePath
          if (mod) modulePath = mod.startsWith('.') ? path.resolve(mod) : require.resolve(mod)
          return modulePath && crossPlatformPath(modulePath)
        }).filter((depPath, index, array) => {
          if (!depPath) return false
          const unique = array.indexOf(depPath) === index
          const notSameFile = depPath !== filePath
          return unique && notSameFile
        }) : []

        resolve(filePaths)
      })
      .catch(reject)
  })

  if (cache) cache[filePath] = promise

  return promise
}

async function getDependentFiles (options, filePath, dirs, cache) {
  const extensions = options.extensions || EXTENSIONS
  const filePattern = '*.' + (extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}}`)
  const patterns = dirs.map(dir => path.join(dir, '**', filePattern))
  const filePaths = await glob(patterns, { ignore: [filePath] })
  const dependentFiles = await filter(filePaths, async dependentPath => {
    const dependencies = await getDependencyFiles(options, dependentPath, cache)
    return dependencies.includes(crossPlatformPath(filePath))
  })

  return dependentFiles
}

module.exports = {
  async extractDependentFiles (options, filePath) {
    const { components, templates } = options
    const dirs = [...components]
    if (templates) dirs.push(templates)
    const files = await getDependentFiles(options, filePath, dirs, DEPENDENCY_CACHE)
    return files
  },

  async extractDependencyFiles (options, filePath) {
    delete DEPENDENCY_CACHE[filePath]
    const files = await getDependencyFiles(options, filePath, DEPENDENCY_CACHE)
    return files
  }
}
