const UIengine = require('../../uiengine')

exports.command = 'site'

exports.describe = 'Create the whole site'

exports.builder = yargs =>
  yargs
    .demandOption(['config'])
    .describe('config', 'Path to config file')
    .example('$0 site --config=uiengine.yml')

exports.handler = argv => {
  const opts = {
    config: argv.config,
    debug: argv.debug
  }

  UIengine.generate(opts)
    .then(({ config: { name } }) =>
      console.log(`✅  ${name} generated!`))
    .catch((err) => {
      console.error([`🚨  generating the site failed!`, err.stack].join('\n\n'))
      process.exit(1)
    })
}

