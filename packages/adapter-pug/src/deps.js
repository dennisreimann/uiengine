const { dirname, isAbsolute, join, resolve } = require('path')
const pugParser = require('pug-parser')
const pugLexer = require('pug-lexer')
const pugWalk = require('pug-walk')
const {
  FileUtil: { glob, read },
  StringUtil: { crossPlatformPath }
} = require('@uiengine/util')

const DEPENDENCY_CACHE = {}
const DEPENDENCY_NODE_TYPES = ['Extends', 'Include', 'RawInclude']

// taken from https://stackoverflow.com/a/46842181/183537
async function filter (arr, callback) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

// based on a pull request I proposed for pug-dependencies, see:
// https://github.com/pure180/pug-dependencies/pull/2
async function getDependencyFiles (options, filePath, cache) {
  if (cache && cache[filePath]) return cache[filePath]

  const filePaths = []

  try {
    const contents = await read(filePath)
    const dir = dirname(filePath)
    const lex = pugLexer(contents, { filename: filePath })
    const parsed = pugParser(lex)

    pugWalk(parsed, node => {
      if (DEPENDENCY_NODE_TYPES.includes(node.type)) {
        const filePath = node.file.path
        let dependencyPath

        if (isAbsolute(filePath)) {
          const { basedir } = options || {}
          if (basedir) {
            dependencyPath = join(basedir, filePath)
          } else {
            // mimic pug when receiving an absolute path and basedir is not set
            throw new Error('the "basedir" option is required to use includes and extends with "absolute" paths')
          }
        } else {
          dependencyPath = resolve(dir, filePath)
        }

        // as globby/fast-glob use unixified file paths we convert our path here
        // https://github.com/mrmlnc/fast-glob/pull/56/commits/cc702eab74c1013061001bccb9d5b408f29abd96
        dependencyPath = crossPlatformPath(dependencyPath)

        if (filePaths.indexOf(dependencyPath) === -1) {
          filePaths.push(dependencyPath)
        }
      }
    })
  } catch (err) {
    // console.warn(`Could not parse file "${filePath}"`, err)
  }

  if (cache) cache[filePath] = filePaths

  return filePaths
}

async function getDependentFiles (options, filePath, dirs, cache) {
  const patterns = dirs.map(dir => crossPlatformPath(join(dir, '**', '*.pug')))
  const filePaths = await glob(patterns, { ignore: [filePath] })
  const dependentFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(options, file, cache)
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
