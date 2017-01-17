const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Page = require('./page')

async function generate (options) {
  let state = {}

  // 0. setup state with config
  if (options && typeof options.config === 'string') {
    const config = await Config.read(options.config, options)
    state = R.assoc('config', config, state)
  }

  // 1. fetch entities (pages and components)
  const pages = await Page.fetchAll(state)
  state = R.assoc('pages', pages, state)

  // 2. transform state (navigation, etc.)

  // 3. generate site (output html)

  const value = await Builder.generateSite(state)
  return value
}

module.exports = {
  generate
}
