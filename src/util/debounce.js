const timers = {}

module.exports = (key, fn, delay = 250) => {
  clearTimeout(timers[key])
  timers[key] = setTimeout(fn, delay)
}
