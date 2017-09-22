const gulp = (gulp, options = {}) =>
  require('./gulp')(gulp, options)

const theo = (theo, options = {}) =>
  require('./theo')(theo, options)

module.exports = {
  gulp,
  theo
}
