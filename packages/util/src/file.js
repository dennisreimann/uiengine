const { dirname, extname } = require('path')
const fs = require('fs-extra')

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
  await fs.outputFile(filePath, content)
}

async function copy (src, dst) {
  const dir = dirname(dst)
  await fs.mkdirs(dir)
  await fs.copy(src, dst)
}

module.exports = {
  read,
  write,
  copy,
  extension,
  exists,
  isDirectory,
  requireUncached,
  invalidateRequireCache
}
