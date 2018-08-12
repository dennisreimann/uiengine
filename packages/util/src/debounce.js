const timers = {}

const debounce = (key, fn, delay = 250) => {
  clearTimeout(timers[key])
  timers[key] = setTimeout(fn, delay)
}

module.exports = {
  debounce
}
