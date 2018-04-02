const UIengine = require('../../uiengine')

exports.describe = 'Generate the site'

exports.builder = argv =>
  argv
    .example('$0 generate')
    // watch
    .boolean('watch')
    .default('watch', false)
    .describe('watch', 'Rebuild on file change')
    .alias('w', 'watch')
    // server
    .boolean('serve')
    .default('serve', false)
    .describe('serve', 'Spawn a server')
    .alias('s', 'serve')

exports.handler = argv => {
  UIengine.build(argv)
    .catch(() => { process.exit(1) })
}
