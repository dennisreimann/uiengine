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
const TemplateUtil = require('./util/template')
const VariationUtil = require('./util/variation')

const CONFIG_FILENAME = 'uiengine.yml'

// set the state in this modules scope so that we
// can access it when handling incremental changes
let state = {}

const getState = () => state

async function setupStateWithOptions (options = {}) {
  const configFilePath = options.config || CONFIG_FILENAME
  const config = await Config.read(configFilePath, options)

  return { config }
}

async function generate (options) {
  state = await setupStateWithOptions(options)

  const setupTheme = Theme.setup(state)
  const setupAdapters = Connector.setup(state)
  await Promise.all([setupTheme, setupAdapters])

  await generateContent()

  return state
}

async function generateContent () {
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

async function generateIncrementForFileChange (filePath, action = 'changed') {
  const { source: { components, pages, templates, data, configFile }, theme, debug } = state.config
  const isDeleted = action === 'deleted'
  const file = path.relative(process.cwd(), filePath)
  const isDataFile = !!filePath.startsWith(data)
  const isThemeFile = debug && !!file.match(theme.module)
  const isComponentDir = path.dirname(filePath) === components
  let pageId, componentId, templateId, variationId

  // Skip generating individual items in case the theme or
  // data got changed as we need to regenerate everything
  if (!isDataFile && !isThemeFile) {
    pageId = pages ? PageUtil.pageFilePathToPageId(pages, filePath) : undefined
    componentId = components ? ComponentUtil.componentFilePathToComponentId(components, filePath) : undefined
    variationId = components ? VariationUtil.variationFilePathToVariationId(components, filePath) : undefined
    templateId = templates ? TemplateUtil.templateFilePathToTemplateId(templates, filePath) : undefined
  }

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
    return { file, action, type: 'page', item: pageId }
  } else if (variationId) {
    if (isDeleted) {
      await removeVariation(variationId, componentId)
    } else {
      await regenerateVariation(variationId, componentId)
    }
    return { file, action, type: 'variation', item: variationId }
  } else if (componentId) {
    if (isDeleted && isComponentDir) {
      await removeComponent(componentId)
    } else {
      await Connector.registerComponentFile(state, filePath)
      await regenerateComponent(componentId)
    }
    return { file, action, type: 'component', item: componentId }
  } else if (templateId) {
    await regenerateTemplate(templateId)
    return { file, action, type: 'template', item: templateId }
  } else {
    await generate({ config: configFile })
    return { file, action, type: 'site', item: state.config.name }
  }
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

async function regenerateTemplate (id) {
  await Builder.generatePagesHavingTemplate(state, id)
}

async function removeComponent (id) {
  state = R.dissocPath(['components', id], state)

  await Builder.generatePagesHavingComponent(state, id)
}

const gulp = (gulp, options = {}) =>
  require('./integrations/gulp')(gulp, options)

module.exports = {
  CONFIG_FILENAME,
  setupStateWithOptions,
  getState,
  generate,
  generateIncrementForFileChange,
  gulp
}
