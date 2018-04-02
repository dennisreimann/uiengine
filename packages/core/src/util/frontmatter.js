const R = require('ramda')
const Yaml = require('./yaml')
const parsing = require('./parsing')

// taken from the fastmatter source code, see
// https://github.com/yuanqing/fastmatter/blob/master/index.js

// this is "forked" to enable custom js-yaml instance with custom types.

var isSeparator = function (line) {
  // the '---' separator can have trailing whitespace but not leading whitespace
  return line[0] === '-' && line.trim() === '---'
}

var NEWLINE = '\n'

var fastmatter = function (str, filename, sourcePaths) {
  var bodyOnly = {
    attributes: {},
    body: str
  }

  var lines = str.split(NEWLINE)

  if (!isSeparator(lines[0])) { // no attributes; entire `str` is body
    return bodyOnly
  }

  var attributes = []
  var i = 1
  var len = lines.length
  while (i < len) {
    if (isSeparator(lines[i])) { // end of attributes
      break
    }
    var line = lines[i]
    if (line.trim().length) attributes.push(line)
    i += 1
  }

  if (i === lines.length) { // second '---' is missing; assume entire `str` is body
    return bodyOnly
  }

  return {
    attributes: attributes.length ? Yaml.parseString(attributes.join(NEWLINE), filename, sourcePaths) : {},
    body: lines.slice(i + 1).join(NEWLINE)
  }
}

const parseString = (string, filename, sourcePaths) =>
  fastmatter(string.trim(), filename, sourcePaths)

module.exports = {
  parseString,
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
