const R = require('ramda')
const yaml = require('js-yaml')
const parsing = require('./parsing')

const parseString = s => yaml.safeLoad(s.trim())

module.exports = {
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
