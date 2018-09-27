const UIengine = require('@uiengine/core')

exports.describe = 'Build the site'

exports.builder = argv =>
  argv
    .example('$0 build')
    // watch
    .array('watch')
    .describe('watch', 'Rebuild on file change')
    .alias('w', 'watch')
    // server
    .boolean('serve')
    .default('serve', false)
    .describe('serve', 'Spawn a server')
    .alias('s', 'serve')
    // quiet
    .boolean('info')
    .default('info', true)
    .describe('info', 'Log info output')

exports.handler = argv => {
  UIengine.build(argv)
    .catch(() => { process.exit(1) })
}
