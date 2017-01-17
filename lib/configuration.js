const path = require('path')
const R = require('ramda')
const yaml = require('./util/yaml')

const readPackageJson = () => {
  const packageJson = path.resolve(process.cwd(), 'package.json')
  const data = require(packageJson)

  return data
}

const readFlags = (flags) => {
  const debug = flags.debug || false
  const data = { debug }

  return data
}

async function read (configFilePath, flags = {}) {
  const projectConfig = await yaml.fromFile(configFilePath)
  const packageData = readPackageJson()
  const options = readFlags(flags)
  const { name, version } = packageData
  const defaults = { name, version }
  const data = R.mergeAll([defaults, projectConfig, options])

  return data
}

module.exports = {
  read
}
