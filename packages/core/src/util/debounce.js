const timers = {}

export default function (key, fn, delay = 250) {
  clearTimeout(timers[key])
  timers[key] = setTimeout(fn, delay)
}
