const path = require('path')
const File = require('../../util/file')
const PageUtil = require('../../util/page')

exports.command = 'init [dir]'

exports.desc = 'Create a basic structure and config file'

exports.builder = yargs =>
  yargs
    .default('dir', '.')

exports.handler = argv => {
  const directory = path.resolve(process.cwd(), argv.dir)
  const name = path.basename(directory)
  const pagesDir = 'pages'
  const configFileName = `${name}.yml`
  const configTemplate = require('../templates/config').template
  const pageTemplate = require('../templates/page').template
  const configContent = configTemplate(name).trim()
  const indexContent = pageTemplate('Home').trim()

  const configPath = path.relative(process.cwd(), path.join(directory, configFileName))
  const indexPath = path.relative(process.cwd(), path.join(directory, pagesDir, PageUtil.PAGE_FILENAME))
  const createConfigFile = File.write(configPath, configContent)
  const createIndexPage = File.write(indexPath, indexContent)

  Promise.all([createConfigFile, createIndexPage])
    .then((state) =>
      console.log(`✅  ${name} initialized!

The following files were created:

- ${configPath} (uiengine configuration file)
- ${indexPath} (index page)

Build it using this command:

$ uiengine site --config=${configFileName}

Enjoy! ✌️`))
    .catch((err) => {
      console.error([`🚨  initializing ${name} failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}
