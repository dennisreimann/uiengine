const path = require('path')
const R = require('ramda')
const yaml = require('./util/yaml')

const DEFAULT_THEME = path.resolve(__dirname, '..', 'theme')
const DEFAULT_TEMPLATING = path.resolve(__dirname, 'templating', 'uiengine-templating-pug')

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

const resolveModules = (basedir, { theme = DEFAULT_THEME, templating = DEFAULT_TEMPLATING }) => {
  // if module is a relative path, resolve the absolute path,
  // relative to project config directory (basedir).
  // otherwise assume it's a node module that can be required.
  const resolveModule = (module) => module.startsWith('.') ? path.resolve(basedir, module) : module

  // use path of default templating if no templating has been provided
  theme = resolveModule(theme)
  templating = resolveModule(templating)

  return { theme, templating }
}

const resolvePaths = (basedir, { source, target }) => {
  const resolvePath = (relativePath) => path.resolve(basedir, relativePath)

  source = R.map(resolvePath, source)
  target = R.map(resolvePath, target)

  return { source, target }
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

  // resolve paths, templating, and theme
  const { source, target } = resolvePaths(configPath, projectConfig)
  const { theme, templating } = resolveModules(configPath, projectConfig)

  data = R.assoc('source', source, data)
  data = R.assoc('target', target, data)
  data = R.assoc('theme', theme, data)
  data = R.assoc('templating', templating, data)

  return data
}

module.exports = {
  read
}
