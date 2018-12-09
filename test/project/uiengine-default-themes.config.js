const config = JSON.parse(JSON.stringify(require('./uiengine.config')))

delete config.themes

module.exports = config
