const { basename, join, relative, resolve } = require('path')
const R = require('ramda')
const {
  FileUtil: { copy, exists, write },
  MessageUtil: { reportSuccess, reportError },
  PageUtil: { PAGE_FILENAME },
  StringUtil: { titleize }
} = require('@uiengine/util')

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
    // force
    .boolean('force')
    .describe('force', 'Overwrite existing files')
    .alias('f', 'force')
    .default('force', false)

exports.handler = async argv => {
  const directory = resolve(process.cwd(), argv.dir)
  const configTemplate = require('../templates/config').template
  const previewTemplate = require('../templates/preview').template
  const pageTemplate = require('../templates/initial_page').template
  const defaults = {
    name: titleize(basename(directory)),
    source: {
      components: './src/components',
      templates: './src/templates',
      pages: './src/uiengine/pages',
      data: './src/uiengine/data',
      entities: './src/uiengine/entities'
    },
    target: './dist',
    template: 'uiengine.html',
    ui: {
      lang: 'en',
      hljs: 'atom-one-dark',
      customStylesFile: '/path-to-overrides.css'
    }
  }

  const config = argv.override ? R.mergeDeepRight(defaults, argv.override) : defaults
  const previewContent = previewTemplate(config.name).trim()
  const configContent = configTemplate(config).trim()
  const indexContent = pageTemplate(config.name).trim()
  const previewPath = relative(process.cwd(), join(directory, config.source.templates, config.template))
  const indexPath = relative(process.cwd(), join(directory, config.source.pages, PAGE_FILENAME))
  const configPath = relative(process.cwd(), join(directory, argv.config))

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

  eventuallyWriteFile(configPath, configContent)
  eventuallyWriteFile(previewPath, previewContent)
  eventuallyWriteFile(indexPath, indexContent)

  try {
    await Promise.all(tasks)

    if (argv.demo) {
      const demoPath = resolve(__dirname, '..', '..', 'demo')
      const copyDemoPages = copy(join(demoPath, 'pages'), join(directory, config.source.pages))
      const copyDemoComponents = copy(join(demoPath, 'components'), join(directory, config.source.components))
      const copyDemoTemplates = copy(join(demoPath, 'templates'), join(directory, config.source.templates))

      await Promise.all([copyDemoComponents, copyDemoPages, copyDemoTemplates])
    }

    const message = [`Initialized ${config.name}!`]
    if (filesExisted.length) {
      message.push(
        'The following files already existed:',
        R.map(filePath => '- ' + relative(process.cwd(), filePath), filesExisted).join('\n')
      )
    }
    if (filesCreated.length) {
      message.push(
        'The following files were created:',
        R.map(filePath => '- ' + relative(process.cwd(), filePath), filesCreated).join('\n'),
        'Enjoy! ✌️'
      )
    }
    if (argv.demo) {
      message.push('\nIn addition to these we also created some demo components and pages.\nThese use the html adapter to showcase just the very basics.\n')
    }
    message.push(
      'Go ahead and update the config file according to your needs.\nAfter that you can generate the site using this command:',
      '$ uiengine build'
    )
    reportSuccess(message)
  } catch (err) {
    reportError(`Initializing ${config.name} failed!`, err)
    process.exit(1)
  }
}
