const { basename, join, relative, resolve } = require('path')
const { PAGE_FILENAME } = require('../../util/page')
const { write } = require('../../util/file')
const { titleize } = require('../../util/string')

exports.desc = 'Create a basic structure and config file'

exports.builder = argv =>
  argv
    .string('dir')
    .default('dir', '.')
    .describe('dir', 'The base directory')

exports.handler = argv => {
  const directory = resolve(process.cwd(), argv.dir)
  const name = titleize(basename(directory))
  const pagesDir = 'src/uiengine/pages'
  const previewFileName = 'src/templates/variant-preview.html'
  const configFileName = argv.config
  const configTemplate = require('../templates/config').template
  const previewTemplate = require('../templates/preview').template
  const pageTemplate = require('../templates/initial_page').template
  const previewContent = previewTemplate(name).trim()
  const configContent = configTemplate(name, pagesDir).trim()
  const indexContent = pageTemplate(name).trim()
  const previewPath = relative(process.cwd(), join(directory, previewFileName))
  const configPath = relative(process.cwd(), join(directory, configFileName))
  const indexPath = relative(process.cwd(), join(directory, pagesDir, PAGE_FILENAME))
  const createPreviewFile = write(previewPath, previewContent)
  const createConfigFile = write(configPath, configContent)
  const createIndexPage = write(indexPath, indexContent)

  Promise.all([createConfigFile, createIndexPage, createPreviewFile])
    .then(state => {
      const configOpt = configFileName !== 'uiengine.yml' ? `--config=${configFileName}` : ''
      console.log(`✅  Initialized ${name}!

The following files were created:

- ${configPath} (config file)
- ${indexPath} (index page)
- ${previewPath} (preview file)

Go ahead and update the config file according to your needs.
After that you can generate the site using this command:

$ uiengine build ${configOpt}

Enjoy! ✌️`)
    })
    .catch(err => {
      console.error([`🚨  Initializing ${name} failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}
