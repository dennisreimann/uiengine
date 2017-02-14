exports.command = 'scaffold'

exports.describe = 'Create basic files for a new component/page'

exports.builder = yargs =>
  yargs
    .demandOption(['config'])
    .demandCommand(1)
    .describe('config', 'Path to config file')
    .example('$0 scaffold <component_id> --config=uiengine.yml')

exports.handler = argv =>
  console.log('TODO: Not implemented yet')
