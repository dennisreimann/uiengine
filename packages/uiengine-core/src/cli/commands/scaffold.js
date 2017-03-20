const path = require('path')
const R = require('ramda')
const UIengine = require('../../uiengine')
const File = require('../../util/file')
const ComponentUtil = require('../../util/component')
const VariationUtil = require('../../util/variation')
const String = require('../../util/string')

const getTemplate = id =>
  require(`../templates/${id}`).template

exports.command = 'scaffold'

exports.describe = 'Create basic files for a new component/page'

exports.builder = yargs =>
  yargs
    .demandOption(['config'])
    .demandCommand(1)
    .nargs('componentId', 1)
    .describe('config', 'Path to config file')
    .example('$0 scaffold <component_id> [variation1_id variation2_id ...] --config=uiengine.yml')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }
  const componentId = argv._[1]
  const variations = argv._.slice(2)
  const variationNames = variations.length ? variations : [componentId]

  UIengine.setupStateWithOptions(opts)
    .then(({ config }) => {
      // component
      const componentsDir = config.source.components
      const componentTitle = String.titleize(componentId)
      const componentTemplate = getTemplate('component')
      const componentContent = componentTemplate(componentTitle).trim()
      const componentFilePath = path.relative(process.cwd(), path.join(componentsDir, componentId, ComponentUtil.COMPONENT_FILENAME))
      const tasks = [File.write(componentFilePath, componentContent)]

      // variations
      const variationFiles = []
      const createVariations = R.map(variationName => {
        const variationId = `${componentId}/${variationName}.md`
        const variationTitle = String.titleize(variationName)
        const variationTemplate = getTemplate('variation')
        const variationContent = variationTemplate(variationTitle).trim()
        const variationFilePath = VariationUtil.variationIdToVariationFilePath(componentsDir, variationId)
        variationFiles.push(variationFilePath)
        return File.write(variationFilePath, variationContent)
      }, variationNames)

      tasks.push(...createVariations)

      Promise.all(tasks)
        .then((state) =>
          console.log(`✅  ${componentId} scaffolded!

The following files were created:

- ${componentFilePath} (component file)
` + R.map(variationFile => '- ' + path.relative(process.cwd(), variationFile), variationFiles).join('\n') + `

Add the component to a page by adding the component id to the page file:

---
title: PAGE_TITLE
components:
- ${componentId}
---

Enjoy! ✌️`))
    })
    .catch((err) => {
      console.error([`🚨  scaffolding the component ${componentId} failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}
