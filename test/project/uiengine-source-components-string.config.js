const config = JSON.parse(JSON.stringify(require('./uiengine.config')))

config.source.components = './src/components'

module.exports = config
