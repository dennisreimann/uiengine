const { dirname, join } = require('path')
const { outputFile, remove } = require('fs-extra')
const Core = require('@uiengine/core/src/core')
const glob = require('globby')
const prettier = require('prettier')
const FrontmatterUtil = require('../../frontmatter')
const { MessageUtil: { reportSuccess, reportError, reportInfo } } = require('@uiengine/util')

exports.describe = 'Replaces component.md files with component.config.js and README.md'

exports.handler = async argv => {
  try {
    const state = await Core.init(argv)
    const { config: { source } } = state
    const { components } = source

    if (!components) return

    const patterns = components.map(componentsPath => join(componentsPath, '**', 'component.md'))
    const filePaths = await glob(patterns, { onlyFiles: true })

    filePaths.forEach(async componentMdPath => {
      const componentPath = dirname(componentMdPath)
      const readmePath = join(componentPath, 'README.md')
      const configPath = join(componentPath, 'component.config.js')
      const { attributes, body } = await FrontmatterUtil.fromFile(componentMdPath, source)
      const tasks = []

      if (Object.keys(attributes).length > 0) {
        outputFile(configPath, prettier.format(`module.exports = ${JSON.stringify(attributes, null, 2)}\n`))
      }

      if (body.length) {
        tasks.push(outputFile(readmePath, body + '\n'))
      }

      await Promise.all(tasks)
      await remove(componentMdPath)
    })

    if (filePaths.length > 0) {
      reportSuccess('The component.md files have been replaced with component.config.js and README.md files.')
    } else {
      reportInfo('No component.md files to migrate.', { icon: 'ℹ️', transient: false })
    }
  } catch (err) {
    reportError('Migrating the component.md files failed!', err)
    process.exit(1)
  }
}
