const UIengine = require('../../uiengine')

exports.describe = 'Generate the site'

exports.builder = argv =>
  argv
    .example('$0 generate')
    // watch
    .boolean('watch')
    .default('watch', false)
    .describe('watch', 'Rebuild on modification')
    .alias('w', 'watch')
    // server
    .boolean('serve')
    .default('serve', false)
    .describe('serve', 'Spawn a server')
    .alias('s', 'serve')

exports.handler = argv => {
  console.log(`🚧  Generating …\n`)

  UIengine.build(argv)
    .then(({ state, server, watcher }) => {
      console.log(`✅  Generating done!\n`)
    })
    .catch((err) => {
      console.error([`🚨  Generating failed!`, err.stack].join('\n\n') + '\n')
      process.exit(1)
    })
}
