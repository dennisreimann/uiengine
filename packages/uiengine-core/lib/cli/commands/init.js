exports.command = 'init [dir]'

exports.desc = 'Create a basic structure and config file'

exports.builder = yargs =>
  yargs
    .default('dir', '.')

exports.handler = argv =>
  console.log('WIP')
