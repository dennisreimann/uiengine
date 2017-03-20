const path = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Variation = require('./variation')
const Page = require('./page')
const Theme = require('./theme')
const Connector = require('./connector')
const PageUtil = require('./util/page')
const ComponentUtil = require('./util/component')
const VariationUtil = require('./util/variation')

// set the state in this modules scope so that we
// can access it when handling incremental changes
let state = {}

const getState = () => state

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
  const setupAdapters = Connector.setup(state)
  await Promise.all([setupTheme, setupAdapters])

  // 1. data fetching
  const fetchPages = Page.fetchAll(state)
  const fetchComponents = Component.fetchAll(state)
  const fetchVariations = Variation.fetchAll(state)
  const [pages, components, variations] = await Promise.all([fetchPages, fetchComponents, fetchVariations])

  state = R.assoc('pages', pages, state)
  state = R.assoc('components', components, state)
  state = R.assoc('variations', variations, state)

  // 2. transformations
  const navigation = await Navigation.fetch(state)

  state = R.assoc('navigation', navigation, state)

  // 3. output
  const generateSite = Builder.generateSite(state)
  const dumpState = Builder.dumpState(state)
  await Promise.all([generateSite, dumpState])

  return state
}

// TODO: Add handler for template changes
async function generateIncrementForFileChange (options, filePath, action = 'changed') {
  const isDeleted = action === 'deleted'
  const { components, pages } = state.config.source
  const file = path.relative('.', filePath)
  const isComponentDir = path.dirname(filePath) === components
  let type, item

  const pageId = pages ? PageUtil.pageFilePathToPageId(pages, filePath) : undefined
  let componentId = components ? ComponentUtil.componentFilePathToComponentId(components, filePath) : undefined
  let variationId = components ? VariationUtil.variationFilePathToVariationId(components, filePath) : undefined

  // In case a component directory has been deleted we
  // need to reset the component id with the dirname
  if (componentId && isComponentDir) {
    componentId = ComponentUtil.componentPathToComponentId(components, filePath)
  }

  // It is more efficient to rebuild the whole component
  // in case a variation meta file changes, as we would
  // have to find affected variation ids and rebuild
  // them individually.
  if (variationId && variationId.endsWith('.md')) {
    variationId = undefined
  }

  if (pageId) {
    if (isDeleted) {
      await removePage(pageId)
    } else {
      await regeneratePage(pageId)
    }
    type = 'page'
    item = pageId
  } else if (variationId) {
    if (isDeleted) {
      await removeVariation(variationId, componentId)
    } else {
      await regenerateVariation(variationId, componentId)
    }
    type = 'variation'
    item = variationId
  } else if (componentId) {
    if (isDeleted && isComponentDir) {
      await removeComponent(componentId)
    } else {
      await Connector.registerComponentFile(state, filePath)
      await regenerateComponent(componentId)
    }
    type = 'component'
    item = componentId
  } else {
    await generate(options)

    type = 'site'
    item = state.config.name
  }

  return { file, type, item, action }
}

async function fetchAndAssocPage (id) {
  const page = await Page.fetchById(state, id)
  state = R.assocPath(['pages', id], page, state)
  return page
}

async function fetchAndAssocComponent (id) {
  const component = await Component.fetchById(state, id)
  state = R.assocPath(['components', id], component, state)
  return component
}

async function fetchAndAssocVariation (id) {
  const variation = await Variation.fetchById(state, id)
  state = R.assocPath(['variations', id], variation, state)
  return variation
}

async function fetchAndAssocNavigation () {
  const navigation = await Navigation.fetch(state)
  state = R.assoc('navigation', navigation, state)
  return navigation
}

async function removePage (id) {
  const parentId = PageUtil.parentIdForPageId(id)

  state = R.dissocPath(['pages', id], state)

  await fetchAndAssocPage(parentId)
  await fetchAndAssocNavigation()
  await Builder.generatePage(state, parentId)
}

async function regeneratePage (id) {
  const parentId = PageUtil.parentIdForPageId(id)

  const fetchPage = fetchAndAssocPage(id)
  const fetchParent = fetchAndAssocPage(parentId)
  await Promise.all([fetchPage, fetchParent])

  await fetchAndAssocNavigation()

  const buildPage = Builder.generatePage(state, id)
  const buildParent = Builder.generatePage(state, parentId)
  const buildComponents = Builder.generateComponentsForPage(state, id)
  const copyFiles = Builder.copyPageFiles(state, id)
  await Promise.all([buildPage, buildParent, buildComponents, copyFiles])
}

async function regenerateVariation (id, componentId) {
  const fetchVariation = fetchAndAssocVariation(id)
  const fetchComponent = fetchAndAssocComponent(componentId)
  await Promise.all([fetchVariation, fetchComponent])

  const buildVariation = Builder.generateVariation(state, id)
  const buildPages = Builder.generatePagesHavingComponent(state, componentId)
  await Promise.all([buildPages, buildVariation])
}

async function removeVariation (id, componentId) {
  state = R.dissocPath(['variations', id], state)
  await fetchAndAssocComponent(componentId)
  await Builder.generatePagesHavingComponent(state, componentId)
}

async function regenerateComponent (id) {
  const { variationIds } = await fetchAndAssocComponent(id)
  const fetchAndAssocVariations = R.map(fetchAndAssocVariation, variationIds)
  await Promise.all(fetchAndAssocVariations)

  const buildPages = Builder.generatePagesHavingComponent(state, id)
  const buildVariations = Builder.generateComponentVariations(state, id)
  await Promise.all([buildPages, buildVariations])
}

async function removeComponent (id) {
  state = R.dissocPath(['components', id], state)

  await Builder.generatePagesHavingComponent(state, id)
}

module.exports = {
  setupStateWithOptions,
  getState,
  generate,
  generateIncrementForFileChange
}
