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
  .use(require('markdown-it-implicit-figures'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-container'), 'intro')
  .use(require('markdown-it-container'), 'details', {
    validate (params) {
      return params.trim().match(/^details\s+(.*)$/)
    },

    render (tokens, idx) {
      const { info, nesting } = tokens[idx]
      const isOpening = nesting === 1
      const [, summary] = info.trim().match(/^details\s+(.*)$/) || []
      return isOpening
        ? `<details><summary>${summary}</summary>\n`
        : '</details>\n'
    }
  })

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
