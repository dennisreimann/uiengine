const R = require('ramda')
const MarkdownIt = require('markdown-it')
const parsing = require('./parsing')

const md = new MarkdownIt()
const parseString = s => md.render(s.trim()).trim()

module.exports = {
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
