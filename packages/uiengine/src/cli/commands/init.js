const path = require('path')
const File = require('../../util/file')
const PageUtil = require('../../util/page')

exports.desc = 'Create a basic structure and config file'

exports.builder = argv =>
  argv
    .string('dir')
    .default('dir', '.')
    .describe('dir', 'The base directory')

exports.handler = argv => {
  const directory = path.resolve(process.cwd(), argv.dir)
  const name = path.basename(directory)
  const pagesDir = 'src/uiengine/pages'
  const configFileName = argv.config
  const configTemplate = require('../templates/config').template
  const pageTemplate = require('../templates/page').template
  const configContent = configTemplate(name, pagesDir).trim()
  const indexContent = pageTemplate('Home').trim()

  const configPath = path.relative(process.cwd(), path.join(directory, configFileName))
  const indexPath = path.relative(process.cwd(), path.join(directory, pagesDir, PageUtil.PAGE_FILENAME))
  const createConfigFile = File.write(configPath, configContent)
  const createIndexPage = File.write(indexPath, indexContent)

  Promise.all([createConfigFile, createIndexPage])
    .then((state) => {
      const configOpt = configFileName !== 'uiengine.yml' ? `--config=${configFileName}` : ''
      console.log(`✅  ${name} initialized!

The following files were created:

- ${configPath} (config file)
- ${indexPath} (index page)

Go ahead and update the config file according to your needs.
After that you can generate the site using this command:

$ uiengine generate ${configOpt}

Enjoy! ✌️`)
    })
    .catch((err) => {
      console.error([`🚨  initializing ${name} failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}
