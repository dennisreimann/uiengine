const path = require('path')
const UIengine = require('../uiengine')

require('yargs')
  // debug
  .boolean('debug')
  .global('debug')
  .default('debug', false)
  .describe('debug', 'Flag to enable debug mode')
  // config
  .string('config')
  .global('config')
  .default('config', UIengine.CONFIG_FILENAME)
  .describe('config', 'Path to config file')
  // command
  .demandCommand(1)
  .commandDir(path.join(__dirname, 'commands'))
  // help / usage
  .usage(`Usage: $0 <command> [options]`)
  .help()
  .argv
