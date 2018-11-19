const { join, relative } = require('path')
const R = require('ramda')
const Core = require('@uiengine/core/src/core')
const Connector = require('@uiengine/core/src/connector')
const {
  ComponentUtil: { COMPONENT_CONFNAME, COMPONENT_DOCSNAME },
  VariantUtil: { VARIANTS_DIRNAME },
  FileUtil: { exists, write },
  StringUtil: { titleize },
  MessageUtil: { reportSuccess, reportError }
} = require('@uiengine/util')

const getTemplate = id => require(`../templates/${id}`)

exports.describe = 'Create basic files for a new component'

exports.builder = yargs =>
  yargs
    .demandCommand(1)
    .example('$0 component <component_id> [variant1 variant2 ...]')
    // force
    .boolean('force')
    .describe('force', 'Overwrite existing files')
    .alias('f', 'force')
    .default('force', false)

exports.handler = async argv => {
  const componentId = argv._[1]
  const variants = argv._.slice(2)
  const variantNames = variants.length ? variants : [componentId]

  try {
    const state = await Core.init(argv)
    const { config } = state

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

    // component
    const cwd = process.cwd()
    const componentDirs = config.source.components
    const componentsDir = componentDirs[0] // create component in first folder
    const componentDir = relative(cwd, join(componentsDir, componentId))
    const componentTitle = titleize(componentId)
    const confTemp = getTemplate('component_config')
    const docsTemp = getTemplate('component_readme')
    const confData = confTemp(componentTitle)
    const docsData = docsTemp(componentTitle)
    const confPath = join(componentDir, COMPONENT_CONFNAME)
    const docsPath = join(componentDir, COMPONENT_DOCSNAME)

    eventuallyWriteFile(confPath, confData)
    eventuallyWriteFile(docsPath, docsData)

    // adapters
    const adapters = Object.keys(config.adapters)
    const adapterFilesForComponent = R.map(ext => Connector.filesForComponent(state, ext, componentId), adapters)
    const adapterFilesForVariants = []

    // variants
    R.forEach(variantName => {
      const filesForVariant = R.map(ext => Connector.filesForVariant(state, ext, componentId, variantName), adapters)
      adapterFilesForVariants.push(...filesForVariant)
    }, variantNames)

    // opposed to the `files` the adapter files are promises,
    // so we have to wait until they are resolved
    const filesForComponent = await Promise.all(adapterFilesForComponent)
    // flatten adapter arrays
    const componentFileInfos = [].concat.apply([], filesForComponent)
    // turn component adapter fileinfos into tasks
    R.forEach(({ basename, data }) => {
      const filePath = join(componentDir, basename)

      eventuallyWriteFile(filePath, data)
    }, componentFileInfos)

    const filesForVariants = await Promise.all(adapterFilesForVariants)
    // flatten adapter arrays
    const variantFileInfos = [].concat.apply([], filesForVariants)

    // turn variant adapter fileinfos into tasks
    R.forEach(({ basename, data }) => {
      const filePath = join(componentDir, VARIANTS_DIRNAME, basename)

      eventuallyWriteFile(filePath, data)
    }, variantFileInfos)

    await Promise.all(tasks)

    const message = [`${componentTitle} created!`]
    if (filesExisted.length) {
      message.push(
        'The following files already existed:',
        R.map(filePath => '- ' + relative(cwd, filePath), filesExisted).join('\n')
      )
    }
    if (filesCreated.length) {
      message.push(
        'The following files were created:',
        R.map(filePath => '- ' + relative(cwd, filePath), filesCreated).join('\n'),
        'Enjoy! ✌️'
      )
    }
    message.push('Add the component to a page by adding the component id to the page file:',
      `module.exports = {
  components: ['${componentId}']
}`)
    reportSuccess(message)
  } catch (err) {
    reportError(`Creating the component ${componentId} failed!`, err)
    process.exit(1)
  }
}
