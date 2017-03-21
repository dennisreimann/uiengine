const UIengine = require('../../uiengine')

exports.describe = 'Generate the site'

exports.builder = argv =>
  argv
    .example('$0 generate')

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

