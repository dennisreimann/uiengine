const path = require('path') // dont spread import because of "resolve" ambiguity
const glob = require('globby')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')
const { buildQueued } = require('./util')

const DEPENDENCY_CACHE = {}

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
      .then(({ chunk }) => {
        // https://webpack.js.org/api/stats#chunk-objects
        const filePaths = chunk ? chunk.modules.map(({ id, name }) => {
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

        resolve(filePaths)
      })
      .catch(err => { // eslint-disable-line handle-callback-err
        // console.debug(`Error getting dependencies for "${filePath}": `, err)
        resolve([])
      })
  })

  if (cache) cache[filePath] = promise

  return promise
}

async function getDependentFiles (options, filePath, dirs, cache) {
  const extensions = Array.from(new Set(['js', options.ext]))
  const exts = extensions.length === 1 ? extensions[0] : `{${extensions.join(',')}}`
  const patterns = dirs.map(dir => path.join(dir, '**', `*.${exts}`))
  const filePaths = await glob(patterns, {
    ignore: [
      filePath,
      path.join('**', `*{.,_}{config,marko,spec,test}.${exts}`),
      path.join('**', '__*'),
      path.join('**', 'variants')
    ]
  })

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
