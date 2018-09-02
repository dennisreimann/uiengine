const { red, gray } = require('chalk')
const { UiengineInputError } = require('./error')

const markSample = gray

const getText = msg =>
  msg instanceof Array ? msg.join('\n\n') : msg

const reportSuccess = msg => {
  reportInfo(msg, { icon: '✅', transient: false })
}

const reportInfo = (msg, opts = { icon: 'ℹ️', transient: true }) => {
  process.stdout.write(`${opts.icon}  ${getText(msg)}${opts.transient ? '\r' : '\n'}`)
}

const reportError = (msg, err) => {
  const text = getText(msg)

  let errMessage = ''
  if (err instanceof UiengineInputError) {
    const { message, stack } = err.originalError || {}
    errMessage = `\n\n${err.message}\n\n${stack || message}`
  } else if (err) {
    errMessage = `\n\n${err.stack || err.message}`
  }

  process.stderr.write(`🚨  ${red(text)}${errMessage}\n\n`)
}

module.exports = {
  markSample,
  reportSuccess,
  reportInfo,
  reportError
}
