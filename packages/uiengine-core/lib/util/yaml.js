const fs = require('fs')
const yaml = require('js-yaml')

async function readFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err)
      const parsed = yaml.safeLoad(data)

      resolve(parsed)
    })
  })
}

module.exports = {
  readFile
}
