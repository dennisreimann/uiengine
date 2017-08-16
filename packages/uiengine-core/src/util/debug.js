const message = require('./message')

const debug = (level, state, label, ...additional) => {
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

module.exports = {
  debug: (...args) => debug(1, ...args),
  debug2: (...args) => debug(2, ...args),
  debug3: (...args) => debug(3, ...args),
  debug4: (...args) => debug(4, ...args),
  debug5: (...args) => debug(5, ...args)
}
