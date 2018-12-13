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

const assertExists = (filePath, message) => {
  assert(exists(filePath), message || `File does not exist: ${filePath}`)
}

const assertDoesNotExist = (filePath, message) => {
  assert(!exists(filePath), message || `File exist: ${filePath}`)
}

const matches = (content, expected) => {
  // see https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
  const regexp = typeof expected === 'string' ? expected.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&') : expected
  const match = content.match(regexp)

  return match !== null
}

const assertMatches = (content, regexp) => {
  assert(matches(content, regexp), `\n\n${content}\n\ndoes not match\n\n${regexp}`)
}

const assertDoesNotMatch = (content, regexp) => {
  assert(!matches(content, regexp), `\n\n${content}\n\nmatches\n\n${regexp}`)
}

const assertContentMatches = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')

  assert(matches(content, regexp), `Content in file ${filePath} does not match\n\n${regexp}\n\n${content}`)
}

const assertContentDoesNotMatch = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')

  assert(!matches(content, regexp), `Content in file ${filePath} matches\n\n${regexp}\n\n${content}`)
}

module.exports = {
  assertExists,
  assertDoesNotExist,
  assertMatches,
  assertDoesNotMatch,
  assertContentMatches,
  assertContentDoesNotMatch
}
