const titleize = string =>
  string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

module.exports = {
  titleize
}
