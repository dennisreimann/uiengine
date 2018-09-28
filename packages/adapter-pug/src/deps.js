const { readFile } = require('fs-extra')
const { dirname, isAbsolute, join, resolve } = require('path')
const pugParser = require('pug-parser')
const pugLexer = require('pug-lexer')
const pugWalk = require('pug-walk')
const glob = require('globby')
const {
  VariantUtil: { VARIANTS_DIRNAME }
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

  let filePaths = []

  try {
    const contents = await readFile(filePath, 'utf-8')
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
  const patterns = dirs.map(dir => join(dir, '**', '*.pug'))
  const variantPaths = dirs.map(dir => join(dir, '**', VARIANTS_DIRNAME))
  const ignore = [filePath, ...variantPaths]
  const filePaths = await glob(patterns, { ignore })
  const dependentFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(options, file, cache)
    return dependencies.includes(filePath)
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
