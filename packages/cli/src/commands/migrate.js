const { join } = require('path')

exports.describe = 'Migrate from previous version'

exports.builder = yargs =>
  yargs
    .demandCommand(1)
    .example('$0 migrate <migration>')
    .commandDir(join(__dirname, 'migrations'))
