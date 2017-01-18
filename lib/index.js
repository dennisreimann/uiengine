const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Page = require('./page')
const Renderer = require('./renderer')

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

  // 1. setup (rendering) and data fetching (pages and components)
  // TODO:
  // - fetch components
  // - copy theme assets
  const setupRenderContext = Renderer.setupContext(state)
  const fetchPages = Page.fetchAll(state)
  const [ pages ] = await Promise.all([ fetchPages, setupRenderContext ])
  state = R.assoc('pages', pages, state)

  // 2. transform state (navigation)
  const navigation = await Navigation.forPageIdAsRoot(state, 'index')
  state = R.assoc('navigation', navigation, state)

  // 3. generate site (output html)
  state = await Builder.generateSite(state)

  return state
}

module.exports = {
  generate
}
