const assert = require('assert')
const assertExists = require('./assertExists')
const fs = require('fs-extra')

module.exports = (filePath, regexp) => {
  assertExists(filePath)

  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(regexp)

  assert.equal(match, null, `Content in file ${filePath} matches\n\n${regexp}\n\n${content}`)
}
