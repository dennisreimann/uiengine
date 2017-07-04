const path = require('path')
const R = require('ramda')
const assert = require('assert')
const glob = require('globby')
const Yaml = require('./util/yaml')
const TemplateUtil = require('./util/template')
const { error } = require('./util/message')

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
    throw new Error(error(`${type} needs to be a configuration object (with module and options keys) or a module string (requireable path or name):`, config))
  }
}

const resolveTemplates = (templatesPath, config) => {
  if (!templatesPath || !path.isAbsolute(templatesPath)) return config

  // templates that are explicitely listed in the config
  const resolveDeclaredTemplates = R.partial(resolvePath, [templatesPath])
  const declared = R.map(resolveDeclaredTemplates, config)

  // templates that exist inside the templates directory
  const pattern = path.join(templatesPath, `**/*.*`)
  const paths = glob.sync(pattern)
  const templates = R.reduce((tmpl, templatePath) => {
    const id = TemplateUtil.templateFilePathToTemplateId(templatesPath, templatePath)
    tmpl[id] = templatePath

    return tmpl
  }, declared, paths)

  return templates
}

async function read (configFilePath, flags = {}) {
  const projectConfig = await Yaml.fromFile(configFilePath)
  return _read(configFilePath, flags, projectConfig)
}

function readSync (configFilePath, flags = {}) {
  const projectConfig = Yaml.fromFileSync(configFilePath)
  return _read(configFilePath, flags, projectConfig)
}

const _read = (configFilePath, flags, projectConfig) => {
  // retrieve config and options
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
  source.base = configPath
  source.configFile = resolvePath(configPath, configFilePath)
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
  read,
  readSync
}
