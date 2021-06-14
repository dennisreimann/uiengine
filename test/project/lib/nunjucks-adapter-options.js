const { resolve } = require('path')

module.exports = {
  trimBlocks: true,
  lstripBlocks: true,
  noCache: true,
  globals: {
    time: () => new Date().getTime()
  },
  filters: {
    shorten: (str, count) => str.slice(0, count || 5)
  }
}
