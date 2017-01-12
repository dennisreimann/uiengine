const Config = require('./configuration')
const Builder = require('./builder')

async function generate (options) {
  let config
  if (options && typeof options.config === 'string') {
    config = Config.read(options.config, options)
  }

  console.log('builder started')
  const value = await Builder.generateSite(config)
  console.log('builder done', value)
  return value
}

module.exports = {
  generate
}
