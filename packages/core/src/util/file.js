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
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        reject(err)
      } else {
        resolve(string.trim())
      }
    })
  })
}

export async function write (filePath, content) {
  return new Promise((resolve, reject) => {
    const dir = dirname(filePath)
    fs.mkdirs(dir, err => {
      if (err) {
        reject(err)
      } else {
        fs.writeFile(filePath, content, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

export async function copy (src, dst) {
  return new Promise((resolve, reject) => {
    const dir = dirname(dst)
    fs.mkdirs(dir, err => {
      if (err) {
        reject(err)
      } else {
        fs.copy(src, dst, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

export default {
  read,
  write,
  copy,
  extension,
  exists,
  isDirectory
}
