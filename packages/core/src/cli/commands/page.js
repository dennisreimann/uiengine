const { relative } = require('path')
const R = require('ramda')
const Core = require('../../core')
const File = require('../../util/file')
const PageUtil = require('../../util/page')
const { reportSuccess, reportError } = require('../../util/message')

exports.describe = 'Create basic files for a new page'

exports.builder = argv =>
  argv
    .demandCommand(1)
    .example('$0 page <page_id> [page2_id page3_id ...]')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }
  const pageId = argv._[1]
  const additionalPageIds = argv._.slice(2)
  const pageIds = additionalPageIds.length ? [pageId, ...additionalPageIds] : [pageId]

  Core.init(opts)
    .then(({ config }) => {
      const pagesDir = config.source.pages
      const pageTemplate = require('../templates/page').template

      const tasks = []
      const pageFiles = []
      const createPages = R.map(pageId => {
        const pageTitle = PageUtil.pageIdToTitle(pageId)
        const pageContent = pageTemplate(pageTitle).trim()
        const pageFilePath = PageUtil.pageIdToPageFilePath(pagesDir, pageId)
        pageFiles.push(pageFilePath)

        return File.write(pageFilePath, pageContent)
      }, pageIds)

      tasks.push(...createPages)

      Promise.all(tasks)
        .then(state => {
          reportSuccess([
            `${pageIds.length === 1 ? pageId : 'Pages'} created!`,
            'The following files were created:',
            R.map(pageFile => '- ' + relative(process.cwd(), pageFile), pageFiles).join('\n'),
            'Enjoy! ✌️'
          ])
        })
        .catch((err) => {
          reportError(`Creating the ${pageIds.length === 1 ? 'page' : 'pages'} failed!`, err)
          process.exit(1)
        })
    })
}
