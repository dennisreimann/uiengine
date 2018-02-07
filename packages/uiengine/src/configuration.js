const { dirname, resolve } = require('path')
const R = require('ramda')
const assert = require('assert')
const Yaml = require('./util/yaml')
const { error } = require('./util/message')

const readPackageJson = () => {
  let data = {}
  try {
    const packageJson = resolve(process.cwd(), 'package.json')
    data = require(packageJson)
  } catch (err) {}

  return data
}

const readFlags = flags => {
  return flags.debug ? { debug: flags.debug } : {}
}

// if module is a relative path, resolve the absolute path,
// relative to project config directory (basedir).
// otherwise assume it's a node module that can be required.
const resolveModule = (basedir, module) =>
  module.startsWith('.') ? resolve(basedir, module) : module

const resolvePath = (basedir, relativePath) =>
  resolve(basedir, relativePath)

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
  const configPath = dirname(configFilePath)
  const packageData = readPackageJson()
  const options = readFlags(flags)

  // initialize data with defaults
  const { name, version } = packageData
  const update = Date.now()
  const defaults = { name, version, update }
  let data = R.mergeAll([defaults, projectConfig, options])

  // resolve paths, adapters, and theme
  let { source, target, theme, adapters } = projectConfig

  assert(source, 'Please provide a "source" config.')
  assert(target, 'Please provide a "target" config with the destination path for the generated site.')

  const resolvePaths = R.partial(resolvePath, [configPath])
  const resolveAdapters = R.partial(resolvePackage, [configPath], 'Adapter')

  source = R.map(resolvePaths, source)
  source.base = resolve(configPath)
  source.configFile = resolvePath(configPath, configFilePath)
  target = resolvePath(configPath, target)
  theme = resolveTheme(configPath, theme)
  adapters = R.map(resolveAdapters, adapters || {})

  data = R.assoc('source', source, data)
  data = R.assoc('target', target, data)
  data = R.assoc('theme', theme, data)
  data = R.assoc('adapters', adapters, data)

  return data
}

module.exports = {
  read,
  readSync
}
