const { dirname, resolve } = require('path')
const R = require('ramda')
const assert = require('assert')
const cosmiconfig = require('cosmiconfig')
const {
  UiengineInputError,
  FileUtil: { invalidateRequireCache },
  MessageUtil: { markSample }
} = require('@uiengine/util')

const readPackageJson = () => {
  let data = {}
  try {
    const packageJson = resolve(process.cwd(), 'package.json')
    data = require(packageJson)
  } catch (err) {}

  return data
}

const readFlags = flags => {
  return Object.assign({}, (flags.debug ? { debug: flags.debug } : {}), flags.override)
}

// if module is a relative path, resolve the absolute path,
// relative to project config directory (basedir).
// otherwise assume it's a node module that can be required.
const resolveModule = (basedir, module) =>
  module.startsWith('.') ? resolve(basedir, module) : module

const resolvePath = (basedir, relativePath) => {
  if (relativePath instanceof Array) {
    return relativePath.map(thePath => resolvePath(basedir, thePath))
  } else {
    return resolve(basedir, relativePath)
  }
}

const resolvePathAsArray = (basedir, relativePath) => {
  if (!(relativePath instanceof Array)) relativePath = [relativePath]

  return relativePath.map(p => resolvePath(basedir, p))
}

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
    throw new UiengineInputError(`${type} needs to be a configuration object (with module and options keys) or a module string (requireable path or name):`, markSample(config))
  }
}

async function read (flags = {}) {
  // do not cache and clesar require cache, because of incremental builds
  const explorer = cosmiconfig('uiengine', { cache: false, rcExtensions: true })
  const configPath = resolvePath(process.cwd(), flags.config || 'uiengine.config.js')

  try {
    invalidateRequireCache(configPath)
    const result = await explorer.load(configPath)

    if (result) {
      return _read(result.filepath, result.config, flags)
    } else {
      throw new UiengineInputError(`No configuration found. Please specify it in ${configPath}`)
    }
  } catch (err) {
    throw new UiengineInputError(`Could not read UIengine configuration:\n\n${err.message}`)
  }
}

const _read = (configFilePath, projectConfig, flags) => {
  // retrieve config and options
  const configPath = dirname(configFilePath)
  const packageData = readPackageJson()
  const options = readFlags(flags)

  // initialize data with defaults
  const { name, version } = packageData
  const update = Date.now()
  const defaults = { name, version, update }
  let data = R.mergeAll([defaults, projectConfig, options])

  // resolve paths, adapters, and ui
  let { source, target, ui, adapters } = data

  assert(source, 'Please provide a "source" config.')
  assert(target, 'Please provide a "target" config with the destination path for the generated site.')

  const resolvePaths = R.partial(resolvePath, [configPath])
  const resolveAdapters = R.partial(resolvePackage, [configPath], 'Adapter')

  source = R.map(resolvePaths, source)
  source.base = resolve(configPath)
  source.configFile = resolvePath(configPath, configFilePath)
  source.components = resolvePathAsArray(configPath, source.components)
  target = resolvePath(configPath, target)
  adapters = R.map(resolveAdapters, adapters || {})
  ui = data.ui || {}

  data = R.assoc('source', source, data)
  data = R.assoc('target', target, data)
  data = R.assoc('ui', ui, data)
  data = R.assoc('adapters', adapters, data)

  return data
}

module.exports = {
  read
}
