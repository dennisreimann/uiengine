const { join } = require('path')

export default require('yargs')
  // config
  .string('config')
  .global('config')
  .default('config', 'uiengine.config.js')
  .describe('config', 'Path to config file')
  .alias('c', 'config')
  // config overrides
  .array('override')
  .global('override')
  .describe('override', 'Config overrides, i.e. override.ui.base="/patterns/"')
  // debug
  .number('debug')
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
  .recommendCommands()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue('Documentation: https://uiengine.uix.space/')
  .argv
