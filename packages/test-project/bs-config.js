const path = require('path')

// Browser-sync config file
// http://www.browsersync.io/docs/options/
const historyApiFallback = require('connect-history-api-fallback')
const baseDir = path.resolve(__dirname, '../../test/tmp')
const files = path.join(baseDir, '**', '*')

module.exports = {
  notify: false,
  open: false,
  injectChanges: false,
  files,
  server: {
    baseDir,
    middleware: [ historyApiFallback() ]
  },
  reloadThrottle: 2500,
  watchOptions: {
    ignoreInitial: true,
    awaitWriteFinish: true
  }
}
