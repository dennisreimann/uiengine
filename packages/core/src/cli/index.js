const { join } = require('path')

export default require('yargs')
  // config
  .global('config')
  .string('config')
  .default('config', 'uiengine.config.js')
  .describe('config', 'Path to config file')
  .alias('c', 'config')
  // config overrides
  .global('override')
  .array('override')
  .describe('override', 'Config overrides, i.e. override.ui.base="/patterns/"')
  // debug
  .global('debug')
  .choices('debug', [0, 1, 2, 3, 4])
  .default('debug', 0)
  .describe('debug', 'Flag to set the debug level')
  .alias('d', 'debug')
  // command
  .demandCommand(1)
  .commandDir(join(__dirname, 'commands'))
  // help / usage
  .usage(`Usage: $0 <command> [options]`)
  .help()
  .recommendCommands()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue('Documentation: https://uiengine.uix.space/')
  .argv
