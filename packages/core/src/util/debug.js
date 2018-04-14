const message = require('./message')

const _debug = (level, state, label, ...additional) => {
  const { debug } = state.config
  if (!debug || level > debug) return

  const [, timingLabel, timingEvent] = label.match(/(.*):(start|end)$/) || []
  if (timingLabel) {
    const action = timingEvent === 'start' ? 'time' : 'timeEnd'
    console[action](message.info(timingLabel))
  } else {
    console.info(message.info(label, additional.join(['\n\n'])))
  }
}

export const debug = (...args) => _debug(1, ...args)
export const debug2 = (...args) => _debug(2, ...args)
export const debug3 = (...args) => _debug(3, ...args)
export const debug4 = (...args) => _debug(4, ...args)
export const debug5 = (...args) => _debug(5, ...args)
