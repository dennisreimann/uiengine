const fs = require('fs')

async function fromFile (parseString, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        resolve(undefined)
      } else {
        const parsed = parseString(string)

        resolve(parsed)
      }
    })
  })
}

async function fromString (parseString, string) {
  return new Promise((resolve, reject) => {
    if (string.length === 0) {
      resolve(undefined)
    } else {
      const parsed = parseString(string)

      resolve(parsed)
    }
  })
}

module.exports = {
  fromFile,
  fromString
}
