// Browser-sync config file
// http://www.browsersync.io/docs/options/
const historyApiFallback = require('connect-history-api-fallback')
const baseDir = '../../test/tmp'

module.exports = {
  notify: false,
  open: false,
  files: baseDir,
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
