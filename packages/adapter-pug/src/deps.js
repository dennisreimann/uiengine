const PugDependencies = require('pug-dependencies')
const { join } = require('path')
const glob = require('globby')
const commondir = require('commondir')

const DEPENDENCY_CACHE = {}

// taken from https://stackoverflow.com/a/46842181/183537
async function filter (arr, callback) {
  const fail = Symbol('filter')
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

async function getDependencyFiles (filePath, cache) {
  if (cache && cache[filePath]) return cache[filePath]

  let filePaths = []

  try {
    filePaths = new PugDependencies(filePath)
  } catch (err) {
    // console.warn(`Could not parse file "${filePath}"`, err)
  }

  if (cache) cache[filePath] = filePaths

  return filePaths
}

async function getDependentFiles (filePath, root, cache) {
  const filePaths = await glob([join(root, '**', '*.pug')], {
    ignore: [filePath]
  })
  const dependantFiles = await filter(filePaths, async file => {
    const dependencies = await getDependencyFiles(file, cache)
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
    const files = await getDependentFiles(filePath, root, DEPENDENCY_CACHE)
    return files
  },

  async extractDependencyFiles (options, filePath) {
    delete DEPENDENCY_CACHE[filePath]
    const files = await getDependencyFiles(filePath, DEPENDENCY_CACHE)
    return files
  }
}
