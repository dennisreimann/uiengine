const assert = require('assert')
const { readFileSync, statSync } = require('fs-extra')

const exists = filePath => {
  try {
    const stat = statSync(filePath)
    return stat.isFile() || stat.isDirectory()
  } catch (err) {
    return false
  }
}

const assertExists = filePath => {
  assert(exists(filePath), `File does not exist: ${filePath}`)
}

const assertDoesNotExist = filePath => {
  assert(!exists(filePath), `File exist: ${filePath}`)
}

const assertMatches = (content, regexp) => {
  const match = content.match(regexp)

  assert(match, `\n\n${content}\n\ndoes not match\n\n${regexp}`)
}

const assertDoesNotMatch = (content, regexp) => {
  const match = content.match(regexp)

  assert.strictEqual(match, null, `\n\n${content}\n\nmatches\n\n${regexp}`)
}

const assertContentMatches = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')
  const match = content.match(regexp)

  assert(match, `Content in file ${filePath} does not match\n\n${regexp}\n\n${content}`)
}

const assertContentDoesNotMatch = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')
  const match = content.match(regexp)

  assert.strictEqual(match, null, `Content in file ${filePath} matches\n\n${regexp}\n\n${content}`)
}

module.exports = {
  assertExists,
  assertDoesNotExist,
  assertMatches,
  assertDoesNotMatch,
  assertContentMatches,
  assertContentDoesNotMatch
}
