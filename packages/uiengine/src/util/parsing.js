const { readFile, readFileSync } = require('fs')

function fromFileSync (parseString, filePath, sourcePaths) {
  const string = readFileSync(filePath, 'utf8')
  const parsed = parseString(string, filePath, sourcePaths)

  return parsed
}

async function fromFile (parseString, filePath, sourcePaths) {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, string) => {
      if (err) {
        reject(err)
      } else {
        const parsed = parseString(string, filePath, sourcePaths)

        resolve(parsed)
      }
    })
  })
}

async function fromString (parseString, string, sourcePaths) {
  return new Promise((resolve, reject) => {
    if (string.length === 0) {
      resolve(undefined)
    } else {
      const parsed = parseString(string, null, sourcePaths)

      resolve(parsed)
    }
  })
}

module.exports = {
  fromFileSync,
  fromFile,
  fromString
}
