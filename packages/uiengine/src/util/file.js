const path = require('path')
const fs = require('fs-extra')

const extension = filePath =>
  path.extname(filePath).replace(/^\./, '')

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

async function read (filePath) {
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

async function write (filePath, content) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath)
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

async function copy (src, dst) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dst)
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

module.exports = {
  read,
  write,
  copy,
  extension,
  exists,
  isDirectory
}
