const timers = {}

export const debounce = (key, fn, delay = 100) => {
  clearTimeout(timers[key])
  timers[key] = setTimeout(fn, delay)
}
