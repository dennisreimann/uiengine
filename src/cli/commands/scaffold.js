const path = require('path')
const R = require('ramda')
const UIengine = require('../../uiengine')
const File = require('../../util/file')
const ComponentUtil = require('../../util/component')
const VariantUtil = require('../../util/variant')
const String = require('../../util/string')

const getTemplate = id =>
  require(`../templates/${id}`).template

exports.describe = 'Create basic files for a new component/page'

exports.builder = argv =>
  argv
    .demandCommand(1)
    .example('$0 scaffold <component_id> [variant1 variant2 ...]')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }
  const componentId = argv._[1]
  const variants = argv._.slice(2)
  const variantNames = variants.length ? variants : [componentId]

  UIengine.setupStateWithOptions(opts)
    .then(({ config }) => {
      // component
      const componentsDir = config.source.components
      const componentTitle = String.titleize(componentId)
      const componentTemplate = getTemplate('component')
      const componentContent = componentTemplate(componentTitle).trim()
      const componentFilePath = path.relative(process.cwd(), path.join(componentsDir, componentId, ComponentUtil.COMPONENT_FILENAME))
      const tasks = [File.write(componentFilePath, componentContent)]

      // variants
      const variantFiles = []
      const createVariants = R.map(variantName => {
        const variantId = `${componentId}/${variantName}.md`
        const variantTitle = String.titleize(variantName)
        const variantTemplate = getTemplate('variant')
        const variantContent = variantTemplate(variantTitle).trim()
        const variantFilePath = VariantUtil.variantIdToVariantFilePath(componentsDir, variantId)
        variantFiles.push(variantFilePath)
        return File.write(variantFilePath, variantContent)
      }, variantNames)

      tasks.push(...createVariants)

      Promise.all(tasks)
        .then((state) =>
          console.log(`✅  ${componentId} scaffolded!

The following files were created:

- ${componentFilePath} (component file)
` + R.map(variantFile => '- ' + path.relative(process.cwd(), variantFile), variantFiles).join('\n') + `

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
