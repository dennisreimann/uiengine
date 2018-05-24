const { basename, join, relative, resolve } = require('path')
const { PAGE_FILENAME } = require('../../util/page')
const { copy, write } = require('../../util/file')
const { titleize } = require('../../util/string')

exports.desc = 'Create a basic structure and config file'

exports.builder = argv =>
  argv
    // base directory
    .string('dir')
    .default('dir', '.')
    .describe('dir', 'The base directory')
    // demo
    .boolean('demo')
    .describe('demo', 'Add some demo content')

exports.handler = async argv => {
  const directory = resolve(process.cwd(), argv.dir)
  const name = titleize(basename(directory))
  const components = 'src/components'
  const templates = 'src/templates'
  const pages = 'src/uiengine/pages'
  const preview = 'uiengine.html'
  const config = 'uiengine.config.js'
  const configTemplate = require('../templates/config').template
  const previewTemplate = require('../templates/preview').template
  const pageTemplate = require('../templates/initial_page').template
  const previewContent = previewTemplate(name).trim()
  const configContent = configTemplate(name, { components, pages, templates }, { preview }).trim()
  const indexContent = pageTemplate(name).trim()
  const previewPath = relative(process.cwd(), join(directory, templates, preview))
  const configPath = relative(process.cwd(), join(directory, config))
  const indexPath = relative(process.cwd(), join(directory, pages, PAGE_FILENAME))
  const createPreviewFile = write(previewPath, previewContent)
  const createConfigFile = write(configPath, configContent)
  const createIndexPage = write(indexPath, indexContent)

  try {
    await Promise.all([createConfigFile, createIndexPage, createPreviewFile])

    if (argv.demo) {
      const demoPath = resolve(__dirname, '../../../demo')
      const copyDemoPages = copy(join(demoPath, 'pages'), join(directory, pages))
      const copyDemoComponents = copy(join(demoPath, 'components'), join(directory, components))
      const copyDemoTemplates = copy(join(demoPath, 'templates'), join(directory, templates))

      await Promise.all([copyDemoComponents, copyDemoPages, copyDemoTemplates])
    }
    console.log(`✅  Initialized ${name}!

The following files were created:

- ${configPath} (config file)
- ${indexPath} (index page)
- ${previewPath} (preview file)
${argv.demo ? '\nIn addition to these we also created some demo components and pages.\nThese use the html adapter to showcase just the very basics.\n' : ''}
Go ahead and update the config file according to your needs.
After that you can generate the site using this command:

$ uiengine build

Enjoy! ✌️`)
  } catch (err) {
    console.error([`🚨  Initializing ${name} failed!`, err.stack].join('\n\n'))
    process.exit(1)
  }
}
