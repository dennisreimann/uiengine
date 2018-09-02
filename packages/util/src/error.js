class UiengineInputError extends Error {
  constructor (message, originalError) {
    if (message instanceof Array) {
      message = message.join('\n\n')
    }
    super(message)

    this.name = this.constructor.name
    this.originalError = originalError

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  UiengineInputError
}
