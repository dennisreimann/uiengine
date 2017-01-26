const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Page = require('./page')
const Theme = require('./theme')

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

  // 1. data fetching
  const fetchPages = Page.fetchAll(state)
  const [pages] = await Promise.all([fetchPages])
  state = R.assoc('pages', pages, state)

  // 2. setup and transformations
  const setupTheme = Theme.setup(state)
  const createNavigation = Navigation.forPages(state)
  const [navigation] = await Promise.all([createNavigation, setupTheme])
  state = R.assoc('navigation', navigation, state)

  // 3. output
  const generateSite = Builder.generateSite(state)
  await Promise.all([generateSite])

  return state
}

module.exports = {
  generate
}
