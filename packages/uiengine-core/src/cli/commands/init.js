const path = require('path')
const File = require('../../util/file')

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
  const configContent = `
name: ${name}

target:
  site: ./site
  assets: ./site/assets

source:
  components: ./src/components
  templates: ./src/templates
  includes: ./src/includes
  pages: ./${pagesDir}
`.trim()

  const indexContent = `
---
title: Home
---
# Homepage

Welcome!
`.trim()

  const configPath = path.relative(process.cwd(), path.join(directory, configFileName))
  const indexPath = path.relative(process.cwd(), path.join(directory, pagesDir, `page.md`))
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

Enjoy!`))
    .catch((error) => {
      console.error(`🚨  initializing ${name} failed! \n\n${error}`)
      process.exit(1)
    })
}
