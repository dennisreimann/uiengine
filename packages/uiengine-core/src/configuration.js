const path = require('path')
const R = require('ramda')
const assert = require('assert')
const glob = require('globby')
const chalk = require('chalk')
const yaml = require('./util/yaml')

const readPackageJson = () => {
  let data = {}
  try {
    const packageJson = path.resolve(process.cwd(), 'package.json')
    data = require(packageJson)
  } catch (err) {}

  return data
}

const readFlags = (flags) => {
  const debug = flags.debug || false
  const data = { debug }

  return data
}

// if module is a relative path, resolve the absolute path,
// relative to project config directory (basedir).
// otherwise assume it's a node module that can be required.
const resolveModule = (basedir, module) =>
  module.startsWith('.') ? path.resolve(basedir, module) : module

const resolvePath = (basedir, relativePath) =>
  path.resolve(basedir, relativePath)

const resolveTheme = (basedir, theme = 'uiengine-theme-default') =>
  resolvePackage(basedir, theme, 'Theme')

const resolvePackage = (basedir, config, type) => {
  if (typeof config === 'object' && typeof config.module === 'string') {
    const options = typeof config.options === 'object' ? config.options : {}

    // FIXME: It is ugly to fix option paths in here as we don't know what the
    // option keys might be. They are different per adapter. (here: Pug)
    if (options.basedir) options.basedir = resolvePath(basedir, options.basedir)

    return {
      module: resolveModule(basedir, config.module),
      options
    }
  } else if (typeof config === 'string') {
    return {
      module: resolveModule(basedir, config),
      options: {}
    }
  } else {
    throw new Error(chalk.red(`${type} needs to be a configuration object (with module and options keys) or a module string (requireable path or name): `) + chalk.gray(config))
  }
}

const resolveTemplates = (templatesDir, config) => {
  if (!templatesDir || !path.isAbsolute(templatesDir)) return config

  // templates that are explicitely listed in the config
  const resolveDeclaredTemplates = R.partial(resolvePath, [templatesDir])
  const declared = R.map(resolveDeclaredTemplates, config)

  // templates that exist inside the templates directory
  const pattern = path.join(templatesDir, `**/*.*`)
  const paths = glob.sync(pattern)
  const templates = R.reduce((tmpl, templatePath) => {
    const relative = path.relative(templatesDir, templatePath)
    const dirname = path.dirname(relative)
    const extname = path.extname(relative)
    const name = path.basename(relative, extname)
    const id = path.join(dirname, name)
    tmpl[id] = templatePath

    return tmpl
  }, declared, paths)

  return templates
}

async function read (configFilePath, flags = {}) {
  // retrieve config and options
  const projectConfig = await yaml.fromFile(configFilePath)
  const configPath = path.dirname(configFilePath)
  const packageData = readPackageJson()
  const options = readFlags(flags)

  // initialize data with defaults
  const { name, version } = packageData
  const defaults = { name, version }
  let data = R.mergeAll([defaults, projectConfig, options])

  // resolve paths, adapters, and theme
  let { source, target, theme, adapters, templates } = projectConfig

  assert(source, 'Please provide a "source" config.')
  assert(target, 'Please provide a "target" config with the destination path for the generated site.')

  const resolvePaths = R.partial(resolvePath, [configPath])
  const resolveAdapters = R.partial(resolvePackage, [configPath], 'Adapter')

  source = R.map(resolvePaths, source)
  target = resolvePath(configPath, target)
  theme = resolveTheme(configPath, theme)
  adapters = R.map(resolveAdapters, adapters || {})
  templates = resolveTemplates(source.templates, templates || {})

  data = R.assoc('source', source, data)
  data = R.assoc('target', target, data)
  data = R.assoc('theme', theme, data)
  data = R.assoc('adapters', adapters, data)
  data = R.assoc('templates', templates, data)

  return data
}

module.exports = {
  read
}
