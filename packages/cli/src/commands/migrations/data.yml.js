const { basename, dirname, join } = require('path')
const Core = require('@uiengine/core/src/core')
const glob = require('globby')
const prettier = require('prettier')
const YamlUtil = require('../../yaml')
const {
  FileUtil: { write, remove },
  MessageUtil: { reportSuccess, reportError, reportInfo },
  StringUtil: { crossPlatformPath }
} = require('@uiengine/util')

exports.describe = 'Replaces data.yml files with data.js'

exports.handler = async argv => {
  try {
    const state = await Core.init(argv)
    const { config: { source } } = state
    const { data } = source

    if (!data) return

    const pattern = crossPlatformPath(join(data, '**', '*.yml'))
    const filePaths = await glob(pattern, { onlyFiles: true })

    filePaths.forEach(async ymlPath => {
      const dataPath = dirname(ymlPath)
      const jsPath = join(dataPath, `${basename(ymlPath, '.yml')}.js`)
      const attributes = await YamlUtil.fromFile(ymlPath)

      await Promise.all([
        write(jsPath, prettier.format(`module.exports = ${JSON.stringify(attributes, null, 2)}`))
      ])
      await remove(ymlPath)
    })

    if (filePaths.length > 0) {
      reportSuccess('The data.yml files have been replaced with data.js files.')
    } else {
      reportInfo('No data.yml files to migrate.', { icon: 'ℹ️', transient: false })
    }
  } catch (err) {
    reportError('Migrating the component.md files failed!', err)
    process.exit(1)
  }
}
