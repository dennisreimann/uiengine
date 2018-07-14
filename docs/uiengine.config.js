const pkg = require('../packages/core/package.json')

module.exports = {
  name: 'UIengine Documentation',
  version: pkg.version,

  source: {
    pages: 'site'
  },

  target: 'dist',

  browserSync: {
    open: false
  }
}
