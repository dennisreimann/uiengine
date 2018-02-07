const { basename, join, relative, resolve } = require('path')
const File = require('../../util/file')
const PageUtil = require('../../util/page')

exports.desc = 'Create a basic structure and config file'

exports.builder = argv =>
  argv
    .string('dir')
    .default('dir', '.')
    .describe('dir', 'The base directory')

exports.handler = argv => {
  const directory = resolve(process.cwd(), argv.dir)
  const name = basename(directory)
  const pagesDir = 'src/uiengine/pages'
  const configFileName = argv.config
  const configTemplate = require('../templates/config').template
  const pageTemplate = require('../templates/page').template
  const configContent = configTemplate(name, pagesDir).trim()
  const indexContent = pageTemplate('Home').trim()

  const configPath = relative(process.cwd(), join(directory, configFileName))
  const indexPath = relative(process.cwd(), join(directory, pagesDir, PageUtil.PAGE_FILENAME))
  const createConfigFile = File.write(configPath, configContent)
  const createIndexPage = File.write(indexPath, indexContent)

  Promise.all([createConfigFile, createIndexPage])
    .then(state => {
      const configOpt = configFileName !== 'uiengine.yml' ? `--config=${configFileName}` : ''
      console.log(`✅  Initialized ${name}!

The following files were created:

- ${configPath} (config file)
- ${indexPath} (index page)

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
