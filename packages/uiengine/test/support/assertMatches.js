const assert = require('assert')

module.exports = (content, regexp) => {
  const match = content.match(regexp)

  assert(match, `\n\n${content}\n\ndoes not match\n\n${regexp}`)
}
