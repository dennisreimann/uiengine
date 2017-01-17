const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Page = require('./page')

async function setupStateWithOptions (options = {}) {
  if (typeof options.config === 'string') {
    const config = await Config.read(options.config, options)
    return { config }
  } else {
    return Promise.reject('Please provide the config file path with the options.')
  }
}

async function generate (options) {
  let state = await setupStateWithOptions(options)

  // 1. fetch entities (pages and components)
  const pages = await Page.fetchAll(state)
  state = R.assoc('pages', pages, state)

  // 2. transform state (navigation, etc.)
  const navigation = await Navigation.forPageIdAsRoot(state, 'index')
  state = R.assoc('navigation', navigation, state)

  // 3. generate site (output html)
  const value = await Builder.generateSite(state)
  return value
}

module.exports = {
  generate
}
