const { readFile } = require('fs-extra')
const { basename, dirname, join, resolve } = require('path')
const { parse } = require('@babel/parser')
const glob = require('globby')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')

// parse in strict mode and allow module declarations, enable jsx syntax
const PARSER_OPTS = {
  sourceType: 'module',
  plugins: [
    'dynamicImport',
    'exportDefaultFrom',
    'jsx',
    'objectRestSpread'
  ]
}
const DEPENDENCY_CACHE = {}
const DEPENDENCY_DECLARATION_TYPES = ['ImportDeclaration', 'ExportNamedDeclaration']
const FILE_TYPES = ['js', 'jsx', 'ts']
const FILE_GLOB_PATTERN = `*.{${FILE_TYPES.join(',')}}`
const INDEX_FILE_REGEXP = new RegExp(`^index.(${FILE_TYPES.join('|')})$`)

// taken from https://stackoverflow.com/a/46842181/183537
async function filter (arr, callback) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

async function getDependencyFiles (parserOpts, filePath, cache) {
  if (cache && cache[filePath]) return cache[filePath]

  // read and parse file
  let parsed
  try {
    const code = await readFile(filePath, 'utf-8')
    parsed = parse(code, parserOpts)
  } catch (err) {
    if (cache) cache[filePath] = []
    return []
  }

  // resolve imports
  const { body } = parsed.program
  const imports = body.filter(node => node.source && DEPENDENCY_DECLARATION_TYPES.includes(node.type))

  const filePaths = imports.map(imp => {
    const importPath = imp.source.value
    const fileDir = dirname(filePath)
    const modulePathOrName = importPath.startsWith('.') ? resolve(fileDir, importPath) : importPath
    let dependencyPath

    try {
      dependencyPath = require.resolve(modulePathOrName)
    } catch (err) {
      // require.resolve does not work for non-js files, i.e. when using css modules
      dependencyPath = modulePathOrName
    }

    // as globby/fast-glob use unixified file paths we convert our path here
    // https://github.com/mrmlnc/fast-glob/pull/56/commits/cc702eab74c1013061001bccb9d5b408f29abd96
    dependencyPath = crossPlatformPath(dependencyPath)

    return dependencyPath
  })

  if (cache) cache[filePath] = filePaths

  return filePaths
}

async function getDependentFiles (parserOpts, filePath, dirs, cache) {
  const patterns = dirs.map(dir => join(dir, '**', FILE_GLOB_PATTERN))
  const filePaths = await glob(patterns, { ignore: [filePath] })
  const dependentFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(parserOpts, file, cache)
    return (
      dependencies.includes(crossPlatformPath(filePath)) ||
      dependencies.find(dependencyFilePath => {
        // assume the index file contains an import for the filePath
        const isIndex = basename(dependencyFilePath).match(INDEX_FILE_REGEXP)
        const folderMatches = dirname(dependencyFilePath) === crossPlatformPath(dirname(filePath))
        return isIndex && folderMatches
      })
    )
  })

  return dependentFiles
}

module.exports = {
  async extractDependentFiles (options, filePath) {
    const { components, templates } = options
    const dirs = [...components]
    if (templates) dirs.push(templates)
    const files = await getDependentFiles(PARSER_OPTS, filePath, dirs, DEPENDENCY_CACHE)
    return files
  },

  async extractDependencyFiles (options, filePath) {
    delete DEPENDENCY_CACHE[filePath]
    const files = await getDependencyFiles(PARSER_OPTS, filePath, DEPENDENCY_CACHE)
    return files
  }
}
