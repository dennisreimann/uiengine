const path = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Variant = require('./variant')
const Page = require('./page')
const Schema = require('./schema')
const Theme = require('./theme')
const Connector = require('./connector')
const PageUtil = require('./util/page')
const SchemaUtil = require('./util/schema')
const ComponentUtil = require('./util/component')
const TemplateUtil = require('./util/template')
const VariantUtil = require('./util/variant')
const { debug2 } = require('./util/debug')
const integrations = require('./integrations')

const CONFIG_FILENAME = 'uiengine.yml'

// track the state of a running generate process to
// cancel regenerating during a full generate
let isCurrentlyGenerating = false

const isGenerating = () => isCurrentlyGenerating

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
  isCurrentlyGenerating = true
  state = await setupStateWithOptions(options)

  debug2(state, 'UIengine.generate():start')

  const setupTheme = Theme.setup(state)
  const setupAdapters = Connector.setup(state)
  await Promise.all([setupTheme, setupAdapters])

  state = await generateContent()
  isCurrentlyGenerating = false

  debug2(state, 'UIengine.generate():end')

  return state
}

async function generateContent () {
  debug2(state, 'UIengine.generateContent():start')

  // 1. data fetching
  const schema = await Schema.fetchAll(state)
  state = R.assoc('schema', schema, state)

  const fetchPages = Page.fetchAll(state)
  const fetchComponents = Component.fetchAll(state)
  const fetchVariants = Variant.fetchAll(state)
  const [pages, components, variants] = await Promise.all([fetchPages, fetchComponents, fetchVariants])

  state = R.assoc('pages', pages, state)
  state = R.assoc('components', components, state)
  state = R.assoc('variants', variants, state)

  // 2. transformations
  const navigation = await Navigation.fetch(state)
  state = R.assoc('navigation', navigation, state)

  // 3. output
  const generateSite = Builder.generateSite(state)
  const dumpState = Builder.dumpState(state)
  await Promise.all([generateSite, dumpState])

  debug2(state, 'UIengine.generateContent():end')

  return state
}

async function generateIncrementForFileChange (filePath, action = 'changed') {
  const { source: { components, pages, templates, data, schema, configFile }, theme, debug } = state.config
  const isDeleted = action === 'deleted'
  const file = path.relative(process.cwd(), filePath)
  const isSchemaFile = !!filePath.startsWith(schema)
  const isDataFile = !isSchemaFile && !!filePath.startsWith(data)
  const isThemeFile = debug && !!file.match(theme.module)
  const isStaticThemeFile = isThemeFile && file.match('/static/')
  const isComponentDir = path.dirname(filePath) === components
  let pageId, componentId, templateId, variantId, schemaId

  // Skip generating individual items in case the theme or
  // data got changed as we need to regenerate everything
  if (!isDataFile && !isThemeFile) {
    pageId = pages ? PageUtil.pageFilePathToPageId(pages, filePath) : undefined
    schemaId = schema ? SchemaUtil.schemaFilePathToSchemaId(schema, filePath) : undefined
    componentId = components ? ComponentUtil.componentFilePathToComponentId(components, filePath) : undefined
    variantId = components ? VariantUtil.variantFilePathToVariantId(components, filePath) : undefined
    templateId = templates ? TemplateUtil.templateFilePathToTemplateId(templates, filePath) : undefined
  }

  // In case a component directory has been deleted we
  // need to reset the component id with the dirname
  if (componentId && isComponentDir) {
    componentId = ComponentUtil.componentPathToComponentId(components, filePath)
  }

  // It is more efficient to rebuild the whole component
  // in case a variant meta file changes, as we would
  // have to find affected variant ids and rebuild
  // them individually.
  if (variantId && variantId.endsWith('.md')) {
    variantId = undefined
  }

  if (pageId) {
    if (isDeleted) {
      await removePage(pageId)
    } else {
      await regeneratePage(pageId)
    }
    return { file, action, type: 'page', item: pageId }
  } else if (variantId) {
    if (isDeleted) {
      await removeVariant(variantId, componentId)
    } else {
      await regenerateVariant(variantId, componentId)
    }
    return { file, action, type: 'variant', item: variantId }
  } else if (componentId) {
    if (isDeleted && isComponentDir) {
      await removeComponent(componentId)
    } else {
      await Connector.registerComponentFile(state, filePath)
      await regenerateComponent(componentId)
    }
    return { file, action, type: 'component', item: componentId }
  } else if (schemaId) {
    await regenerateSchemaPage(schemaId)
    return { file, action, type: 'page', item: 'schema' }
  } else if (templateId) {
    await regenerateTemplate(templateId)
    return { file, action, type: 'template', item: templateId }
  } else if (isStaticThemeFile) {
    await Theme.setup(state)
    return { file, action, type: 'theme static', item: state.config.theme.module }
  } else if (isThemeFile) {
    await generate({ config: configFile })
    return { file, action, type: 'site', item: state.config.name }
  } else {
    await generateContent()
    return { file, action, type: 'site', item: state.config.name }
  }
}

async function fetchAndAssocPage (id) {
  const page = await Page.fetchById(state, id)
  state = R.assocPath(['pages', id], page, state)
  return page
}

async function fetchAndAssocSchema (id) {
  const schema = await Schema.fetchById(state, id)
  state = R.assocPath(['schema', id], schema, state)
  return schema
}

async function fetchAndAssocComponent (id) {
  const component = await Component.fetchById(state, id)
  state = R.assocPath(['components', id], component, state)
  return component
}

async function fetchAndAssocVariant (id) {
  const variant = await Variant.fetchById(state, id)
  state = R.assocPath(['variants', id], variant, state)
  return variant
}

async function fetchAndAssocNavigation () {
  const navigation = await Navigation.fetch(state)
  state = R.assoc('navigation', navigation, state)
  return navigation
}

async function removePage (id) {
  const pageIds = Object.keys(state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)

  state = R.dissocPath(['pages', id], state)

  await fetchAndAssocPage(parentId)
  await fetchAndAssocNavigation()
  await Builder.generatePage(state, parentId)
}

async function regeneratePage (id) {
  const pageIds = Object.keys(state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)
  const fetchTasks = [fetchAndAssocPage(id)]

  if (parentId) fetchTasks.push(fetchAndAssocPage(parentId))
  await Promise.all(fetchTasks)

  await fetchAndAssocNavigation()

  const buildTasks = [
    Builder.generatePage(state, id),
    Builder.copyPageFiles(state, id),
    Builder.generateComponentsForPage(state, id)
  ]
  if (parentId) buildTasks.push(Builder.generatePage(state, parentId))

  await Promise.all(buildTasks)
}

async function regenerateSchemaPage (schemaId) {
  await fetchAndAssocSchema(schemaId)

  await Builder.generatePage(state, PageUtil.SCHEMA_ID)
}

async function regenerateVariant (id, componentId) {
  const fetchVariant = fetchAndAssocVariant(id)
  const fetchComponent = fetchAndAssocComponent(componentId)
  await Promise.all([fetchVariant, fetchComponent])

  const buildVariant = Builder.generateVariant(state, id)
  const buildPages = Builder.generatePagesHavingComponent(state, componentId)
  await Promise.all([buildPages, buildVariant])
}

async function removeVariant (id, componentId) {
  state = R.dissocPath(['variants', id], state)
  await fetchAndAssocComponent(componentId)
  await Builder.generatePagesHavingComponent(state, componentId)
}

async function regenerateComponent (id) {
  const { variantIds } = await fetchAndAssocComponent(id)
  const fetchAndAssocVariants = R.map(fetchAndAssocVariant, variantIds)
  await Promise.all(fetchAndAssocVariants)

  const buildPages = Builder.generatePagesHavingComponent(state, id)
  const buildVariants = Builder.generateComponentVariants(state, id)
  await Promise.all([buildPages, buildVariants])
}

async function regenerateTemplate (id) {
  await Builder.generatePagesHavingTemplate(state, id)
}

async function removeComponent (id) {
  state = R.dissocPath(['components', id], state)

  await Builder.generatePagesHavingComponent(state, id)
}

module.exports = {
  CONFIG_FILENAME,
  setupStateWithOptions,
  getState,
  isGenerating,
  generate,
  generateIncrementForFileChange,
  integrations
}
