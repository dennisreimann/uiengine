const R = require('ramda')
const Core = require('@uiengine/core/src/core')
const {
  FileUtil: { exists, relativeToCwd, write },
  MessageUtil: { reportSuccess, reportError },
  PageUtil: { PAGE_CONFNAME, PAGE_DOCSNAME, pageIdToFilePath, pageIdToTitle }
} = require('@uiengine/util')

const getTemplate = id => require(`../templates/${id}`)

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
    const docsTemp = getTemplate('page_readme')
    const confTemp = getTemplate('page_config')

    const tasks = []
    const filesCreated = []
    const filesExisted = []

    const eventuallyWriteFile = (filePath, content) => {
      if (exists(filePath) && !argv.force) {
        filesExisted.push(filePath)
      } else {
        tasks.push(write(filePath, content))
        filesCreated.push(filePath)
      }
    }

    const createPages = R.map(pageId => {
      const pageTitle = pageIdToTitle(pageId)
      const confData = confTemp(pageTitle)
      const docsData = docsTemp(pageTitle)
      const confPath = pageIdToFilePath(pagesDir, pageId, PAGE_CONFNAME)
      const docsPath = pageIdToFilePath(pagesDir, pageId, PAGE_DOCSNAME)

      eventuallyWriteFile(confPath, confData)
      eventuallyWriteFile(docsPath, docsData)
    }, pageIds)

    tasks.push(...createPages)

    await Promise.all(tasks)

    const message = [`${pageIds.length === 1 ? pageId : 'Pages'} created!`]
    if (filesExisted.length) {
      message.push(
        'The following files already existed:',
        R.map(filePath => '- ' + relativeToCwd(filePath), filesExisted).join('\n')
      )
    }
    if (filesCreated.length) {
      message.push(
        'The following files were created:',
        R.map(filePath => '- ' + relativeToCwd(filePath), filesCreated).join('\n'),
        'Enjoy! ✌️'
      )
    }
    reportSuccess(message)
  } catch (err) {
    reportError(`Creating the ${pageIds.length === 1 ? 'page' : 'pages'} failed!`, err)
    process.exit(1)
  }
}
