const Common = require('./common')
const UIengine = require('../uiengine')
const Config = require('../configuration')

module.exports = (gulp, options) => {
  const configFilePath = options.config || UIengine.CONFIG_FILENAME
  const config = Config.readSync(configFilePath, options)

  const sourceFiles = Common.sourceFilesFromConfig(config)

  return {
    // returns the gulp task to generate the site
    task (name) {
      return gulp.task(name, cb => {
        UIengine.generate(options)
          .then(() => cb())
          .catch(error => console.error('UIengine error:', error))
      })
    },

    // return the gulp watch task that handles file changes
    watch () {
      return gulp.watch(sourceFiles).on('change', event =>
        Common.handleFileChange(event.path, event.type)
      )
    }
  }
}
