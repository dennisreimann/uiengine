const R = require('ramda')
const MarkdownIt = require('markdown-it')
const parsing = require('./parsing')

const markdownIt = new MarkdownIt({
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-anchor'))

const parseString = s => markdownIt.render(s.trim()).trim()

module.exports = {
  markdownIt,
  parseString,
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
