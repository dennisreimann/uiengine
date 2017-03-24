const fs = require('fs')

function fromFileSync (parseString, filePath) {
  const string = fs.readFileSync(filePath, 'utf8')
  const parsed = parseString(string, filePath)

  return parsed
}

async function fromFile (parseString, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        resolve(undefined)
      } else {
        const parsed = parseString(string, filePath)

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
  fromFileSync,
  fromFile,
  fromString
}
