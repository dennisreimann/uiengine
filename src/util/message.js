const chalk = require('chalk')

const error = (primary, secondary) => {
  return chalk.red(primary) + (secondary ? '\n\n' + chalk.gray(secondary) : '')
}

module.exports = {
  error
}
