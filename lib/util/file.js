const path = require('path')
const fs = require('fs-extra')

async function read (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        reject(err)
      } else {
        resolve(string)
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

module.exports = {
  read,
  write
}
