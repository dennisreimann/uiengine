const { readFile } = require('fs-extra')
const { dirname, join } = require('path')
const { parse } = require('@babel/parser')
const glob = require('globby')
const commondir = require('commondir')

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
  const filePaths = imports.map(imp => require.resolve(imp.source.value, {
    paths: [dirname(filePath)]
  }))

  if (cache) cache[filePath] = filePaths

  return filePaths
}

async function getDependentFiles (parserOpts, filePath, root, cache) {
  const filePaths = await glob([join(root, '**', '*.{js,jsx,ts}')], {
    ignore: [filePath]
  })
  const dependantFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(parserOpts, file, cache)
    return dependencies.includes(filePath)
  })

  return dependantFiles
}

module.exports = {
  async extractDependentFiles (options, filePath) {
    const { base, components, templates } = options
    const dirs = [...components]
    if (templates) dirs.push(templates)
    const root = dirs.length ? commondir(dirs) : base
    const files = await getDependentFiles(parserOpts, filePath, root, DEPENDENCY_CACHE)
    return files
  },

  async extractDependencyFiles (options, filePath) {
    delete DEPENDENCY_CACHE[filePath]
    const files = await getDependencyFiles(parserOpts, filePath, DEPENDENCY_CACHE)
    return files
  }
}
