const assert = require('assert')
const fs = require('fs-extra')

module.exports = (filePath) => {
  let isFile = false
  try { isFile = fs.statSync(filePath).isFile() } catch (err) { }

  assert(isFile, `File ${filePath} does not exist.`)
}
