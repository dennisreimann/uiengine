// Browser-sync config file
// http://www.browsersync.io/docs/options/

const baseDir = '../../test/tmp'

module.exports = {
  notify: false,
  open: false,
  files: baseDir,
  server: { baseDir },
  reloadThrottle: 2500,
  watchOptions: {
    ignoreInitial: true,
    awaitWriteFinish: true
  }
}
