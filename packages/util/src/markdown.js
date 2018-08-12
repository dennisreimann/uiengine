const R = require('ramda')
const MarkdownIt = require('markdown-it')
const parsing = require('./parsing')

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-include'))

const parseString = (string, filename, sourcePaths) =>
  markdownIt.render(string.trim()).trim()

const fromFile = R.partial(parsing.fromFile, [parseString])

const fromString = R.partial(parsing.fromString, [parseString])

module.exports = {
  markdownIt,
  parseString,
  fromFile,
  fromString
}
