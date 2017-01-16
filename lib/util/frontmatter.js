const R = require('ramda')
const fastmatter = require('fastmatter')
const parsing = require('./parsing')

const parseString = s => fastmatter(s.trim())

module.exports = {
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
