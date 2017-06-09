const R = require('ramda')
const MarkdownIt = require('markdown-it')
const parsing = require('./parsing')

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-anchor'))

const parseString = (string, filename, sourcePaths) =>
  markdownIt.render(string.trim()).trim()

module.exports = {
  markdownIt,
  parseString,
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
