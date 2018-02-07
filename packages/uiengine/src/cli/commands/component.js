const { join, relative } = require('path')
const R = require('ramda')
const Core = require('../../core')
const Connector = require('../../connector')
const File = require('../../util/file')
const ComponentUtil = require('../../util/component')
const VariantUtil = require('../../util/variant')
const String = require('../../util/string')

const getTemplate = id =>
  require(`../templates/${id}`).template

exports.describe = 'Create basic files for a new component'

exports.builder = argv =>
  argv
    .demandCommand(1)
    .example('$0 component <component_id> [variant1 variant2 ...]')
    // adapters
    .array('exclude')
    .describe('exclude', 'Exclude generating files for adapters')
    .alias('e', 'exclude')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }
  const componentId = argv._[1]
  const variants = argv._.slice(2)
  const variantNames = variants.length ? variants : [componentId]
  const excludeAdapters = argv.exclude || []

  Core.init(opts).then(state => {
    const { config } = state
    const files = {}

    // adapters
    const availableAdapters = Object.keys(config.adapters)
    const adapters = R.difference(availableAdapters, excludeAdapters)

    // component
    const componentsDir = config.source.components
    const componentDir = relative(process.cwd(), join(componentsDir, componentId))
    const componentTitle = String.titleize(componentId)
    const componentTemplate = getTemplate('component')
    const componentData = componentTemplate(componentTitle).trim()
    const componentFilePath = join(componentDir, ComponentUtil.COMPONENT_FILENAME)
    files[componentFilePath] = File.write(componentFilePath, componentData)

    const adapterFilesForComponent = R.map(ext => Connector.filesForComponent(state, ext, componentId), adapters)
    const adapterFilesForVariants = []

    // variants
    R.forEach(variantName => {
      const variantId = `${componentId}/${variantName}.md`
      const title = String.titleize(variantName)
      const template = getTemplate('variant')
      const data = template(title).trim()
      const filePath = VariantUtil.variantIdToVariantFilePath(componentsDir, variantId)
      files[filePath] = File.write(filePath, data)

      const filesForVariant = R.map(ext => Connector.filesForVariant(state, ext, componentId, variantName), adapters)
      adapterFilesForVariants.push(...filesForVariant)
    }, variantNames)

    // opposed to the `files` the adapter files are promises,
    // so we have to wait until they are resolved
    Promise.all(adapterFilesForComponent).then(filesForComponent => {
      // flatten adapter arrays
      const fileInfos = [].concat.apply([], filesForComponent)
      // turn component adapter fileinfos into tasks
      R.forEach(({ basename, data }) => {
        const filePath = join(componentDir, basename)
        files[filePath] = File.write(filePath, data)
      }, fileInfos)

      Promise.all(adapterFilesForVariants).then(filesForVariants => {
        // flatten adapter arrays
        const fileInfos = [].concat.apply([], filesForVariants)
        // turn variant adapter fileinfos into tasks
        R.forEach(({ basename, data }) => {
          const variantId = `${componentId}/${basename}`
          const filePath = VariantUtil.variantIdToVariantFilePath(componentsDir, variantId)
          files[filePath] = File.write(filePath, data)
        }, fileInfos)

        const filePaths = Object.keys(files)
        const fileTasks = Object.values(files)

        Promise.all(fileTasks).then(state => {
          const filesCreated = filePaths.sort().reverse()
          console.log(`✅  ${componentId} created!

The following files were created:

` + R.map(filePath => '- ' + relative(process.cwd(), filePath), filesCreated).join('\n') + `

Add the component to a page by adding the component id to the page file:

---
title: PAGE_TITLE
components:
- ${componentId}
---

Enjoy! ✌️`)
        })
      })
    })
  })
    .catch((err) => {
      console.error([`🚨  creating the component ${componentId} failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}
