const { dirname } = require('path')
const fs = require('fs-extra')

export async function readFile (filePath) {
  const string = await fs.readFile(filePath, 'utf8')
  return string.trim()
}

export async function copyFile (src, dst) {
  const dir = dirname(dst)
  await fs.mkdirs(dir)
  await fs.copy(src, dst)
}
