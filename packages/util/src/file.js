const { dirname, extname, relative } = require('path')
const fs = require('fs-extra')
const glob = require('globby')

const cwd = process.cwd()

const relativeToCwd = filePath =>
  relative(cwd, filePath)

const extension = filePath =>
  extname(filePath).replace(/^\./, '')

const exists = filePath => {
  try {
    const stat = fs.statSync(filePath)
    return stat.isFile() || stat.isDirectory()
  } catch (err) {
    return false
  }
}

const isDirectory = filePath => {
  try {
    return fs.lstatSync(filePath).isDirectory()
  } catch (err) {
    return false
  }
}

const invalidateRequireCache = filePath => {
  delete require.cache[require.resolve(filePath)]
}

const requireUncached = filePath => {
  invalidateRequireCache(filePath)
  return require(filePath)
}

async function read (filePath) {
  const string = await fs.readFile(filePath, 'utf8')
  return string.trim()
}

async function write (filePath, content) {
  await fs.outputFile(filePath, `${content.trim()}\n`)
}

async function copy (src, dst) {
  const dir = dirname(dst)
  fs.mkdirsSync(dir)
  fs.copySync(src, dst, { dereference: true })
}

module.exports = {
  remove: fs.remove,
  removeSync: fs.removeSync,
  ensureDirSync: fs.ensureDirSync,
  read,
  write,
  copy,
  glob,
  extension,
  exists,
  isDirectory,
  requireUncached,
  invalidateRequireCache,
  relativeToCwd
}
