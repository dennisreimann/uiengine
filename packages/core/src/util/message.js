const chalk = require('chalk')

export const error = (primary, secondary) => {
  return chalk.red(primary) + (secondary ? '\n\n' + chalk.gray(secondary) : '')
}

export const info = (primary, secondary) => {
  return chalk.blue(primary) + (secondary ? '\n\n' + chalk.gray(secondary) : '')
}
