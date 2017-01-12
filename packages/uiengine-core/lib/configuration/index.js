const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const deepExtend = require('deep-extend')

const read = (configFilePath, options = {}) => {
  const projectConfig = yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8'))
  const version = require(path.resolve(process.cwd(), 'package.json')).version
  const name = path.basename(configFilePath, path.extname(configFilePath))
  const debug = options.debug || false
  const config = deepExtend({ name, version }, projectConfig, { debug })
  return config
}

module.exports = {
  read
}
