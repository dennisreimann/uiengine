const { yellow } = require('chalk')

const _debug = (level, state, label, ...additional) => {
  const { debug } = state.config
  if (!debug || level > debug) return

  const [, timingLabel, timingEvent] = label.match(/(.*):(start|end)$/) || []
  if (timingLabel) {
    const action = timingEvent === 'start' ? 'time' : 'timeEnd'
    console[action](yellow(timingLabel))
  } else {
    console.info(yellow(label, additional.join(['\n\n'])))
  }
}

const debug = (...args) => _debug(1, ...args)
const debug2 = (...args) => _debug(2, ...args)
const debug3 = (...args) => _debug(3, ...args)
const debug4 = (...args) => _debug(4, ...args)
const debug5 = (...args) => _debug(5, ...args)

module.exports = {
  debug,
  debug2,
  debug3,
  debug4,
  debug5
}
