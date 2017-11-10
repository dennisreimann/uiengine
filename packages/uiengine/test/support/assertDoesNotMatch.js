const assert = require('assert')

module.exports = (content, regexp) => {
  const match = content.match(regexp)

  assert.equal(match, null, `\n\n${content}\n\nmatches\n\n${regexp}`)
}
