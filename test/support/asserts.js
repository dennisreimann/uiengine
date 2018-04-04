const assert = require('assert')
const { readFileSync, statSync } = require('fs-extra')

export const assertMatches = (content, regexp) => {
  const match = content.match(regexp)

  assert(match, `\n\n${content}\n\ndoes not match\n\n${regexp}`)
}

export const assertExists = filePath => {
  let exists = false
  try {
    const stat = statSync(filePath)
    exists = stat.isFile() || stat.isDirectory()
  } catch (err) {}

  assert(exists, `File does not exist: ${filePath}`)
}

export const assertDoesNotMatch = (content, regexp) => {
  const match = content.match(regexp)

  assert.equal(match, null, `\n\n${content}\n\nmatches\n\n${regexp}`)
}

export const assertContentMatches = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')
  const match = content.match(regexp)

  assert(match, `Content in file ${filePath} does not match\n\n${regexp}\n\n${content}`)
}

export const assertContentDoesNotMatch = (filePath, regexp) => {
  assertExists(filePath)

  const content = readFileSync(filePath, 'utf8')
  const match = content.match(regexp)

  assert.equal(match, null, `Content in file ${filePath} matches\n\n${regexp}\n\n${content}`)
}
