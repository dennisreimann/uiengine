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
const debounce = require('./util/debounce')
const integrations = require('./integrations')

const CONFIG_FILENAME = 'uiengine.yml'

// set the state in this modules scope so that we
// can access it when handling incremental changes
let state = {}
const getState = () => state

// track the state of a running generate process to
// cancel regenerating during a full generate
let isCurrentlyGenerating = false
const isGenerating = () => isCurrentlyGenerating

const handleFileChange = (filePath, type) => debounce('handleFileChange', () => {
  if (!isGenerating()) generateIncrementForFileChange(filePath, type)
})

async function build (options = {}) {
  await generate(options)

  let server, watcher
  if (options.serve) server = integrations.startServer(state, options.watch)
  if (options.watch) watcher = integrations.startWatcher(state, options.watch, handleFileChange)

  return { state, server, watcher }
}

async function setupStateWithOptions (options = {}) {
  const configFilePath = options.config || CONFIG_FILENAME
  const config = await Config.read(configFilePath, options)

  return { config }
}

async function generate (options) {
  isCurrentlyGenerating = true
  state = await setupStateWithOptions(options)

  debug2(state, 'UIengine.generate():start')

  // 0. setup
  const setupTheme = Theme.setup(state)
  const setupAdapters = Connector.setup(state)
  await Promise.all([setupTheme, setupAdapters])

  // 1. data fetching
  const fetchPages = Page.fetchAll(state)
  const fetchSchema = Schema.fetchAll(state)
  const fetchComponents = Component.fetchAll(state)
  const fetchVariants = Variant.fetchAll(state)
  const [pages, schema, components, variants] = await Promise.all([fetchPages, fetchSchema, fetchComponents, fetchVariants])

  state = R.assoc('pages', pages, state)
  state = R.assoc('schema', schema, state)
  state = R.assoc('components', components, state)
  state = R.assoc('variants', variants, state)

  // 2. transformations
  const navigation = await Navigation.fetch(state)
  state = R.assoc('navigation', navigation, state)

  // 3. output
  await Builder.generate(state)

  isCurrentlyGenerating = false

  debug2(state, 'UIengine.generate():end')

  return state
}

const getChangeObject = (filePath, action) => {
  const { source: { components, pages, templates, data, schema } } = state.config
  const file = path.relative(process.cwd(), filePath)
  const isSchemaFile = !!filePath.startsWith(schema)
  const isDataFile = !isSchemaFile && !!filePath.startsWith(data)
  const isComponentDir = path.dirname(filePath) === components
  let pageId, componentId, templateId, variantId, schemaId

  // Skip generating individual items in case the data
  // got changed as we need to regenerate everything
  if (!isDataFile) {
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
    return { file, action, type: 'page', item: pageId }
  } else if (variantId) {
    return { file, action, type: 'variant', item: variantId }
  } else if (componentId) {
    return { file, action, type: 'component', item: componentId }
  } else if (schemaId) {
    return { file, action, type: 'schema', item: schemaId }
  } else if (templateId) {
    return { file, action, type: 'template', item: templateId }
  } else {
    return { file, action, type: 'site', item: state.config.name }
  }
}

async function generateIncrementForFileChange (filePath, action = 'changed') {
  const change = getChangeObject(filePath, action)
  const isDeleted = action === 'deleted'
  let fn

  switch (change.type) {
    case 'page':
      fn = isDeleted ? removePage : regeneratePage
      await fn(change.item, change)
      break

    case 'variant':
      fn = isDeleted ? removeVariant : regenerateVariant
      await fn(change.item, change)
      break

    case 'component':
      // check whether or not a file was deleted or the component directory
      const isDirectory = path.basename(filePath) === change.item
      if (isDeleted && isDirectory) {
        await removeComponent(change.item, change)
      } else {
        await Connector.registerComponentFile(state, filePath)
        await regenerateComponent(change.item, change)
      }
      break

    case 'schema':
      await regenerateSchema(change.item, change)
      break

    case 'template':
      await regenerateTemplate(change.item, change)
      break

    default:
      await generate({ config: state.config.source.configFile })
      break
  }

  return change
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

async function removePage (id, change) {
  const pageIds = Object.keys(state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)

  state = R.dissocPath(['pages', id], state)

  await fetchAndAssocPage(parentId)
  await fetchAndAssocNavigation()
  await Builder.generateIncrement(state, change)
}

async function regeneratePage (id, change) {
  const pageIds = Object.keys(state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)
  const fetchTasks = [fetchAndAssocPage(id)]
  if (parentId) fetchTasks.push(fetchAndAssocPage(parentId))

  await Promise.all(fetchTasks)
  await fetchAndAssocNavigation()
  await Promise.all([
    Builder.generatePageWithTemplate(state, id),
    Builder.generatePageFiles(state, id),
    Builder.generateIncrement(state, change)
  ])
}

async function regenerateSchema (schemaId, change) {
  await fetchAndAssocSchema(schemaId)
  await Builder.generateIncrement(state, change)
}

async function regenerateVariant (id, change) {
  const { componentId } = await fetchAndAssocVariant(id)
  await fetchAndAssocComponent(componentId)
  await Promise.all([
    Builder.generateVariant(state, id),
    Builder.generateIncrement(state, change)
  ])
}

async function removeVariant (id, change) {
  const { componentId } = state.variants[id]
  state = R.dissocPath(['variants', id], state)

  await fetchAndAssocComponent(componentId)
  await Builder.generateIncrement(state, change)
}

async function regenerateComponent (id, change) {
  const { variantIds } = await fetchAndAssocComponent(id)
  const fetchAndAssocVariants = R.map(fetchAndAssocVariant, variantIds)

  await Promise.all(fetchAndAssocVariants)
  await Promise.all([
    Builder.generateComponentVariants(state, id),
    Builder.generateIncrement(state, change)
  ])
}

async function regenerateTemplate (id, change) {
  await Promise.all([
    Builder.generatePagesWithTemplate(state, id),
    Builder.generateIncrement(state, change)
  ])
}

async function removeComponent (id, change) {
  state = R.dissocPath(['components', id], state)

  await Builder.generateIncrement(state, change)
}

module.exports = {
  CONFIG_FILENAME,
  setupStateWithOptions,
  getState,
  build,
  isGenerating,
  generate,
  generateIncrementForFileChange,
  integrations
}
