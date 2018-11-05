const { relative } = require('path')
const R = require('ramda')
const Core = require('@uiengine/core/src/core')
const {
  FileUtil: { exists, write },
  MessageUtil: { reportSuccess, reportError },
  PageUtil: { pageIdToFilePath, pageIdToTitle }
} = require('@uiengine/util')

exports.describe = 'Create basic files for a new page'

exports.builder = yargs =>
  yargs
    .demandCommand(1)
    .example('$0 page <page_id> [page2_id page3_id ...]')
    // force
    .boolean('force')
    .describe('force', 'Overwrite existing files')
    .alias('f', 'force')
    .default('force', false)

exports.handler = async argv => {
  const pageId = argv._[1]
  const additionalPageIds = argv._.slice(2)
  const pageIds = additionalPageIds.length ? [pageId, ...additionalPageIds] : [pageId]

  try {
    const { config } = await Core.init(argv)
    const pagesDir = config.source.pages
    const pageTemplate = require('../templates/page').template

    const tasks = []
    const filesCreated = []
    const filesExisted = []

    const createPages = R.map(pageId => {
      const pageTitle = pageIdToTitle(pageId)
      const pageContent = pageTemplate(pageTitle).trim()
      const pageFilePath = pageIdToFilePath(pagesDir, pageId)

      if (exists(pageFilePath) && !argv.force) {
        filesExisted.push(pageFilePath)

        return null
      } else {
        filesCreated.push(pageFilePath)

        return write(pageFilePath, pageContent)
      }
    }, pageIds)

    tasks.push(...createPages)

    await Promise.all(tasks)

    const message = [`${pageIds.length === 1 ? pageId : 'Pages'} created!`]
    if (filesExisted.length) {
      message.push(
        'The following files already existed:',
        R.map(filePath => '- ' + relative(process.cwd(), filePath), filesExisted).join('\n')
      )
    }
    if (filesCreated.length) {
      message.push(
        'The following files were created:',
        R.map(filePath => '- ' + relative(process.cwd(), filePath), filesCreated).join('\n'),
        'Enjoy! ✌️'
      )
    }
    reportSuccess(message)
  } catch (err) {
    reportError(`Creating the ${pageIds.length === 1 ? 'page' : 'pages'} failed!`, err)
    process.exit(1)
  }
}
