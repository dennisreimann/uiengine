const { red, gray } = require('chalk')
const { UiengineInputError } = require('./error')

export const markSample = gray

const getText = msg =>
  msg instanceof Array ? msg.join('\n\n') : msg

export const reportSuccess = msg => {
  console.log('✅ ', getText(msg))
}

export const reportError = (msg, err) => {
  const text = getText(msg)
  const error = err instanceof UiengineInputError ? err.message : err

  console.error('🚨 ', red(text), '\n\n', error)
}
