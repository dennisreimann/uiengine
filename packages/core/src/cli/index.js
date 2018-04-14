const { join } = require('path')

export default require('yargs')
  // debug
  .boolean('number')
  .global('debug')
  .default('debug', 0)
  .describe('debug', 'Flag to enable debug mode')
  .alias('d', 'debug')
  // command
  .demandCommand(1)
  .commandDir(join(__dirname, 'commands'))
  // help / usage
  .usage(`Usage: $0 <command> [options]`)
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .argv
