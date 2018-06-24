const { dirname, extname } = require('path')
const fs = require('fs-extra')

export const extension = filePath =>
  extname(filePath).replace(/^\./, '')

export const exists = filePath => {
  try {
    const stat = fs.statSync(filePath)
    return stat.isFile() || stat.isDirectory()
  } catch (err) {
    return false
  }
}

export const isDirectory = filePath => {
  try {
    return fs.lstatSync(filePath).isDirectory()
  } catch (err) {
    return false
  }
}

export const invalidateRequireCache = filePath => {
  delete require.cache[require.resolve(filePath)]
}

export async function read (filePath) {
  const string = await fs.readFile(filePath, 'utf8')
  return string.trim()
}

export async function write (filePath, content) {
  await fs.outputFile(filePath, content)
}

export async function copy (src, dst) {
  const dir = dirname(dst)
  await fs.mkdirs(dir)
  await fs.copy(src, dst)
}

export default {
  read,
  write,
  copy,
  extension,
  exists,
  isDirectory
}
