const assert = require('assert')
const fs = require('fs-extra')

module.exports = (path) => {
  let exists = false
  try {
    const stat = fs.statSync(path)
    exists = stat.isFile() || stat.isDirectory()
  } catch (err) { }

  assert(exists, `File does not exist: ${path}`)
}
