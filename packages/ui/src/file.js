const { dirname } = require('path')
const fs = require('fs-extra')

export async function readFile (filePath) {
  try {
    const string = await fs.readFile(filePath, 'utf8')

    return string.trim()
  } catch (err) {
    throw err
  }
}

export async function copyFile (src, dst) {
  const dir = dirname(dst)

  try {
    await fs.mkdirs(dir)
    await fs.copy(src, dst)
  } catch (err) {
    throw err
  }
}
