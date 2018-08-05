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

export const assertExists = filePath => {
  assert(exists(filePath), `File does not exist: ${filePath}`)
}

export const assertDoesNotExist = filePath => {
  assert(!exists(filePath), `File exist: ${filePath}`)
}

export const assertMatches = (content, regexp) => {
  const match = content.match(regexp)

  assert(match, `\n\n${content}\n\ndoes not match\n\n${regexp}`)
}

export const assertDoesNotMatch = (content, regexp) => {
  const match = content.match(regexp)

  assert.strictEqual(match, null, `\n\n${content}\n\nmatches\n\n${regexp}`)
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

  assert.strictEqual(match, null, `Content in file ${filePath} matches\n\n${regexp}\n\n${content}`)
}
