const path = require('path')
const R = require('ramda')
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
  resolveModule(basedir, theme)

const resolveAdapter = (basedir, adapter) => {
  if (typeof adapter === 'object' && typeof adapter.module === 'string') {
    const options = typeof adapter.options === 'object' ? adapter.options : {}

    // FIXME: It is ugly to fix option paths in here as we don't know what the
    // option keys might be. They are different per adapter. (here: Pug)
    if (options.basedir) options.basedir = resolvePath(basedir, options.basedir)

    return {
      module: resolveModule(basedir, adapter.module),
      options
    }
  } else if (typeof adapter === 'string') {
    return {
      module: resolveModule(basedir, adapter),
      options: {}
    }
  } else {
    throw new Error(`Adapter needs to be a configuration object (with module and options keys) or a module string (requireable path or name): ${adapter}`)
  }
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
  let { source, target, theme, adapters } = projectConfig
  const resolvePaths = R.partial(resolvePath, [configPath])
  const resolveAdapters = R.partial(resolveAdapter, [configPath])

  source = R.map(resolvePaths, source)
  target = R.map(resolvePaths, target)
  adapters = R.map(resolveAdapters, adapters)
  theme = resolveTheme(configPath, theme)

  data = R.assoc('source', source, data)
  data = R.assoc('target', target, data)
  data = R.assoc('theme', theme, data)
  data = R.assoc('adapters', adapters, data)

  return data
}

module.exports = {
  read
}
