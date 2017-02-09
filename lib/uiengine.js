const path = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Variation = require('./variation')
const Page = require('./page')
const Theme = require('./theme')
const Templating = require('./templating')
const PageUtil = require('./util/page')
const ComponentUtil = require('./util/component')
const VariationUtil = require('./util/variation')

// set the state in this modules scope so that we
// can access it when handling incremental changes
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
  // 0. setup
  state = await setupStateWithOptions(options)

  const setupTheme = Theme.setup(state)
  const setupTemplating = Templating.setup(state)
  await Promise.all([setupTheme, setupTemplating])

  // 1. data fetching
  const fetchPages = Page.fetchAll(state)
  const fetchComponents = Component.fetchAll(state)
  const fetchVariations = Variation.fetchAll(state)
  const [pages, components, variations] = await Promise.all([fetchPages, fetchComponents, fetchVariations])

  state = R.assoc('pages', pages, state)
  state = R.assoc('components', components, state)
  state = R.assoc('variations', variations, state)

  // 2. transformations
  const navigation = await Navigation.forPages(state)

  state = R.assoc('navigation', navigation, state)

  // 3. output
  const generateSite = Builder.generateSite(state)
  const dumpState = Builder.dumpState(state)
  await Promise.all([generateSite, dumpState])

  return state
}

async function generateIncrementForChangedFile (options, filePath) {
  const { components, pages } = state.config.source
  const pagesPath = pages ? path.relative('.', pages) : false
  const componentsPath = components ? path.relative('.', components) : false
  const relativeFilePath = path.relative('.', filePath)
  const pageId = PageUtil.pageFilePathToPageId(pagesPath, filePath)
  const componentId = ComponentUtil.componentFilePathToComponentId(componentsPath, filePath)
  const variationId = VariationUtil.variationFilePathToVariationId(componentsPath, filePath)

  if (pageId) {
    const page = await Page.fetchById(state, pageId)

    const { id } = page
    state = R.assocPath(['pages', id], page, state)

    const navigation = await Navigation.forPages(state)
    state = R.assoc('navigation', navigation, state)

    await Builder.generatePage(state, id)

    return { file: relativeFilePath, type: 'page', item: id }
  } else if (variationId) {
    const variation = await Variation.fetchById(state, variationId)

    const { id } = variation
    state = R.assocPath(['variations', id], variation, state)
    await Builder.generateVariation(state, id)

    return { file: relativeFilePath, type: 'variation', item: id }
  } else if (componentId) {
    const component = await Component.fetchById(state, componentId)

    const { id } = component
    state = R.assocPath(['components', id], component, state)
    await Builder.generateComponent(state, id)

    return { file: relativeFilePath, type: 'component', item: id }
  } else {
    await generate(options)

    return { file: relativeFilePath, type: 'site', item: state.config.name }
  }
}

module.exports = {
  generate,
  generateIncrementForChangedFile
}
