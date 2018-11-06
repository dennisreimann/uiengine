const { join } = require('path')
const { exec } = require('child_process')

exports.describe = 'Migrate from previous version'

exports.builder = yargs =>
  yargs
    .demandCommand(1)
    .example('$0 migrate')
    .commandDir(join(__dirname, 'migrations'))
    .command('$0', 'Migrate to v2', () => {}, yargs => {
      ['component.md', 'page.md', 'data.yml', 'entity.yml'].forEach(migration => {
        exec(`uiengine migrate ${migration}`, 'utf8', (err, stdout, stderr) => {
          process.stdout.write(err ? stderr : stdout)
        })
      })
    })
