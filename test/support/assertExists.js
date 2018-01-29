const assert = require('assert')
const fs = require('fs-extra')

module.exports = filePath => {
  let exists = false
  try {
    const stat = fs.statSync(filePath)
    exists = stat.isFile() || stat.isDirectory()
  } catch (err) {}

  assert(exists, `File does not exist: ${filePath}`)
}
