const { dirname, join } = require('path')
const { outputFile, remove } = require('fs-extra')
const Core = require('@uiengine/core/src/core')
const glob = require('globby')
const {
  FrontmatterUtil,
  MessageUtil: { reportSuccess, reportError },
  StringUtil: { titleFromContentHeading }
} = require('@uiengine/util')

exports.describe = 'Replaces page.md files with page.config.js and README.md'

exports.handler = async argv => {
  try {
    const state = await Core.init(argv)
    const { config: { source } } = state

    const pattern = join(source.pages, '**', 'page.md')
    const filePaths = await glob(pattern, { onlyFiles: true })

    filePaths.forEach(async pageMdPath => {
      const pagePath = dirname(pageMdPath)
      const pageReadme = join(pagePath, 'README.md')
      const pageConfig = join(pagePath, 'page.config.js')
      const { attributes, body } = await FrontmatterUtil.fromFile(pageMdPath, source)
      const contentTitle = titleFromContentHeading(body)
      const attrsTitle = attributes.title
      const tasks = []
      let content = body

      const titleAlreadyInContent = attrsTitle === contentTitle

      if (!titleAlreadyInContent) {
        content = `# ${attrsTitle}\n\n${body}`
        delete attributes.title
      }

      if (Object.keys(attributes).length > 0) {
        tasks.push(outputFile(pageConfig, 'module.exports = ' + JSON.stringify(attributes, null, 2) + '\n'))
      }

      if (content.length) {
        tasks.push(outputFile(pageReadme, content + '\n'))
      }

      await Promise.all(tasks)
      await remove(pageMdPath)
    })

    reportSuccess('Migration succeeded. The page.md files have been replaced with page.config.js and README.md files.')
  } catch (err) {
    reportError('Migrating the page.md files failed!', err)
    process.exit(1)
  }
}
