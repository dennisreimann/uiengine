const { dirname, join } = require('path')
const { outputFile, remove } = require('fs-extra')
const Core = require('@uiengine/core/src/core')
const glob = require('globby')
const {
  FrontmatterUtil,
  MessageUtil: { reportSuccess, reportError }
} = require('@uiengine/util')

exports.describe = 'Replaces component.md files with component.config.js and README.md'

exports.handler = async argv => {
  try {
    const state = await Core.init(argv)
    const { config: { source } } = state

    const patterns = source.components.map(componentsPath => join(componentsPath, '**', 'component.md'))
    const filePaths = await glob(patterns, { onlyFiles: true })

    filePaths.forEach(async componentMdPath => {
      const componentPath = dirname(componentMdPath)
      const readmePath = join(componentPath, 'README.md')
      const configPath = join(componentPath, 'component.config.js')
      const { attributes, body } = await FrontmatterUtil.fromFile(componentMdPath, source)

      await Promise.all([
        outputFile(readmePath, body + '\n'),
        outputFile(configPath, 'module.exports = ' + JSON.stringify(attributes, null, 2) + '\n')
      ])
      await remove(componentMdPath)
    })

    reportSuccess('Migration succeeded. The component.md files have been replaced with component.config.js and README.md files.')
  } catch (err) {
    reportError('Migrating the component.md files failed!', err)
    process.exit(1)
  }
}
