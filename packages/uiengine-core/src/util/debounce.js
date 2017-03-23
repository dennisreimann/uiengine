const timers = {}

module.exports = (key, fn, delay) => {
  clearTimeout(timers[key])
  timers[key] = setTimeout(fn, delay)
}
