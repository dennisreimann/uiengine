const R = require('ramda')
const MarkdownIt = require('markdown-it')
const parsing = require('./parsing')

export const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-include'))

export const parseString = (string, filename, sourcePaths) =>
  markdownIt.render(string.trim()).trim()

export const fromFile = R.partial(parsing.fromFile, [parseString])

export const fromString = R.partial(parsing.fromString, [parseString])
