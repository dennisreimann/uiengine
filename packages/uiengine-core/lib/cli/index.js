const path = require('path')

require('yargs')
  .boolean('debug')
  .default('debug', false)
  .demandCommand(1)
  .describe('debug', 'Flag to enable debug mode')
  .commandDir(path.join(__dirname, 'commands'))
  .usage(`Usage: $0 <command> [options]`)
  .help()
  .argv
