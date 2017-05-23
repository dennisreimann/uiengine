const debug = (level, state, label, message) => {
  const { debug } = state.config
  if (!debug || level > debug) return

  const [, timingLabel, timingEvent] = label.match(/(.*):(start|end)$/) || []
  if (timingLabel) {
    const action = timingEvent === 'start' ? 'time' : 'timeEnd'
    console[action](timingLabel)
  } else {
    console.log(label, message)
  }
}

module.exports = {
  debug: (...args) => debug(1, ...args),
  debug2: (...args) => debug(2, ...args),
  debug3: (...args) => debug(3, ...args),
  debug4: (...args) => debug(4, ...args),
  debug5: (...args) => debug(5, ...args)
}
