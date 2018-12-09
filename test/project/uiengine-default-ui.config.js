const config = JSON.parse(JSON.stringify(require('./uiengine.config')))

delete config.ui

module.exports = config
