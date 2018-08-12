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
  const { message, stack } = err || {}
  const output = `🚨  ${red(text)}` +
    (message ? `\n\n${message}\n\n` : '') +
    (stack && !(err instanceof UiengineInputError) ? `\n\n${stack}\n\n` : '')

  process.stderr.write(output)
}

module.exports = {
  markSample,
  reportSuccess,
  reportInfo,
  reportError
}
