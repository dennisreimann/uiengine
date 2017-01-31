const path = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Page = require('./page')
const Theme = require('./theme')
const PageUtil = require('./util/page')

let state = {}

async function setupStateWithOptions (options = {}) {
  if (typeof options.config === 'string') {
    const config = await Config.read(options.config, options)
    return { config }
  } else {
    return Promise.reject('Please provide the config file path with the options.')
  }
}

async function generate (options) {
  state = await setupStateWithOptions(options)

  // 1. data fetching
  const fetchPages = Page.fetchAll(state)
  const fetchComponents = Component.fetchAll(state)
  const [pages, components] = await Promise.all([fetchPages, fetchComponents])
  state = R.assoc('pages', pages, state)
  state = R.assoc('components', components, state)

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

async function generateIncrementForChangedFile (options, filePath) {
  const pagesPath = path.relative('.', state.config.source.pages)
  const relativeFilePath = path.relative('.', filePath)

  // TODO: Implement the correct behaviour
  if (relativeFilePath.startsWith(pagesPath)) {
    const pageId = PageUtil.pageFilePathToPageId(pagesPath, filePath)

    await generate(options)

    return { file: relativeFilePath, type: 'page', item: pageId }
  } else {
    await generate(options)

    return { file: relativeFilePath, type: 'site', item: state.config.name }
  }
}

module.exports = {
  generate,
  generateIncrementForChangedFile
}
