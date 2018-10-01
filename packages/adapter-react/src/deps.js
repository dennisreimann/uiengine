const { readFile } = require('fs-extra')
const { dirname, join, resolve } = require('path')
const { parse } = require('@babel/parser')
const glob = require('globby')
const {
  VariantUtil: { VARIANTS_DIRNAME }
} = require('@uiengine/util')

// parse in strict mode and allow module declarations, enable jsx syntax
const parserOpts = {
  sourceType: 'module', // 'unambiguous'
  plugins: [
    'jsx'
  ]
}

const DEPENDENCY_CACHE = {}

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
    // console.warn(`Could not parse file "${filePath}"`, err)
    if (cache) cache[filePath] = []
    return []
  }

  // resolve imports
  const { body } = parsed.program
  const imports = body.filter(node => node.type === 'ImportDeclaration')
  const filePaths = imports.map(imp => {
    const importPath = imp.source.value
    const fileDir = dirname(filePath)
    try {
      return require.resolve(importPath, { paths: [fileDir] })
    } catch (err) {
      // require.resolve does not work for non-js files, i.e. when using css modules
      return resolve(fileDir, importPath)
    }
  })

  if (cache) cache[filePath] = filePaths

  return filePaths
}

async function getDependentFiles (parserOpts, filePath, dirs, cache) {
  const patterns = dirs.map(dir => join(dir, '**', '*.{js,jsx,ts}'))
  const variantPaths = dirs.map(dir => join(dir, '**', VARIANTS_DIRNAME))
  const ignore = [filePath, ...variantPaths]
  const filePaths = await glob(patterns, { ignore })
  const dependentFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(parserOpts, file, cache)
    return dependencies.includes(filePath)
  })

  return dependentFiles
}

module.exports = {
  async extractDependentFiles (options, filePath) {
    const { components, templates } = options
    const dirs = [...components]
    if (templates) dirs.push(templates)
    const files = await getDependentFiles(parserOpts, filePath, dirs, DEPENDENCY_CACHE)
    return files
  },

  async extractDependencyFiles (options, filePath) {
    delete DEPENDENCY_CACHE[filePath]
    const files = await getDependencyFiles(parserOpts, filePath, DEPENDENCY_CACHE)
    return files
  }
}
