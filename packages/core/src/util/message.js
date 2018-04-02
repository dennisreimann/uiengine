const chalk = require('chalk')

const error = (primary, secondary) => {
  return chalk.red(primary) + (secondary ? '\n\n' + chalk.gray(secondary) : '')
}

const info = (primary, secondary) => {
  return chalk.blue(primary) + (secondary ? '\n\n' + chalk.gray(secondary) : '')
}

module.exports = {
  error,
  info
}
