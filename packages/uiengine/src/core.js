const { basename, dirname, relative } = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Page = require('./page')
const Entity = require('./entity')
const Theme = require('./theme')
const Connector = require('./connector')
const PageUtil = require('./util/page')
const EntityUtil = require('./util/entity')
const ComponentUtil = require('./util/component')
const TemplateUtil = require('./util/template')
const VariantUtil = require('./util/variant')
const { debug2 } = require('./util/debug')

// set the state in this modules scope so that we
// can access it when handling incremental changes
let _state = {}

// track the state of a running generate process to
// cancel regenerating during a full generate
let _isGenerating = false
const isGenerating = () => _isGenerating

async function init (options = {}) {
  const config = await Config.read(options)

  return { config }
}

async function generate (options) {
  _isGenerating = true
  _state = await init(options)

  debug2(_state, 'Core.generate():start')

  // 0. setup
  const setupTheme = Theme.setup(_state)
  const setupAdapters = Connector.setup(_state)
  await Promise.all([setupTheme, setupAdapters])

  // 1. data fetching
  const fetchPages = Page.fetchAll(_state)
  const fetchEntities = Entity.fetchAll(_state)
  const fetchComponents = Component.fetchAll(_state)
  const [pages, entities, components] = await Promise.all([fetchPages, fetchEntities, fetchComponents])

  _state = R.assoc('pages', pages, _state)
  _state = R.assoc('entities', entities, _state)
  _state = R.assoc('components', components, _state)

  // 2. transformations
  const navigation = await Navigation.fetch(_state)

  _state = R.assoc('navigation', navigation, _state)

  // 3. output
  await Builder.generate(_state)

  _isGenerating = false

  debug2(_state, 'Core.generate():end')

  return _state
}

const getChangeObject = (filePath, action) => {
  const { source: { components, pages, templates, data, entities } } = _state.config
  const file = relative(process.cwd(), filePath)
  const isComponentDir = dirname(filePath) === components
  const isEntityFile = entities && !!filePath.startsWith(entities)
  const isDataFile = !isEntityFile && data && !!filePath.startsWith(data)
  let pageId, componentId, templateId, variantId, entityId

  // Skip generating individual items in case the data
  // got changed as we need to regenerate everything
  if (!isDataFile) {
    pageId = pages ? PageUtil.pageFilePathToPageId(pages, filePath) : undefined
    entityId = entities ? EntityUtil.entityFilePathToEntityId(entities, filePath) : undefined
    variantId = components ? VariantUtil.variantFilePathToVariantId(components, filePath) : undefined
    templateId = templates ? TemplateUtil.templateFilePathToTemplateId(templates, filePath) : undefined
    componentId = components ? ComponentUtil.componentFilePathToComponentId(components, filePath) : undefined
  }

  // In case a component directory has been deleted we
  // need to reset the component id with the dirname
  if (componentId && isComponentDir) {
    componentId = ComponentUtil.componentPathToComponentId(components, filePath)
  }

  if (pageId) {
    return { file, action, type: 'page', item: pageId }
  } else if (variantId) {
    return { file, action, type: 'variant', item: variantId }
  } else if (componentId) {
    return { file, action, type: 'component', item: componentId }
  } else if (entityId) {
    return { file, action, type: 'entity', item: entityId }
  } else if (templateId) {
    return { file, action, type: 'template', item: templateId }
  } else {
    return { file, action, type: 'site', item: _state.config.name }
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

    case 'entity':
      fn = isDeleted ? removeEntity : regenerateEntity
      await regenerateEntity(change.item, change)
      break

    case 'component':
      // check whether a file has been deleted or the component directory
      const isDirectory = basename(filePath) === change.item
      if (isDeleted && isDirectory) {
        await removeComponent(change.item, change)
      } else {
        await Connector.registerComponentFile(_state, filePath)
        await regenerateComponent(change.item, change)
      }
      break

    case 'template':
      await regenerateTemplate(change.item, change)
      break

    default:
      await generate({ config: _state.config.source.configFile })
      break
  }

  return { state: _state, change }
}

async function fetchAndAssocPage (id) {
  const page = await Page.fetchById(_state, id)
  _state = R.assocPath(['pages', id], page, _state)
  return page
}

async function fetchAndAssocEntity (id) {
  const entity = await Entity.fetchById(_state, id)
  _state = R.assocPath(['entities', id], entity, _state)
  return entity
}

async function fetchAndAssocComponent (id) {
  const component = await Component.fetchById(_state, id)
  _state = R.assocPath(['components', id], component, _state)
  return component
}

async function fetchAndAssocNavigation () {
  const navigation = await Navigation.fetch(_state)
  _state = R.assoc('navigation', navigation, _state)
  return navigation
}

async function regeneratePage (id, change) {
  const pageIds = Object.keys(_state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)
  const fetchTasks = [fetchAndAssocPage(id)]
  if (parentId) fetchTasks.push(fetchAndAssocPage(parentId))

  await Promise.all(fetchTasks)
  await fetchAndAssocNavigation()
  await Promise.all([
    Builder.generatePageWithTemplate(_state, id),
    Builder.generatePageFiles(_state, id),
    Builder.generateIncrement(_state, change)
  ])
}

async function removePage (id, change) {
  const pageIds = Object.keys(_state.pages)
  const parentId = PageUtil.parentIdForPageId(pageIds, id)

  _state = R.dissocPath(['pages', id], _state)

  await fetchAndAssocPage(parentId)
  await fetchAndAssocNavigation()
  await Builder.generateIncrement(_state, change)
}

async function regenerateEntity (id, change) {
  await fetchAndAssocEntity(id)
  await Builder.generateIncrement(_state, change)
}

async function removeEntity (id, change) {
  _state = R.dissocPath(['entities', id], _state)
  await Builder.generateIncrement(_state, change)
}

async function regenerateComponent (id, change) {
  await fetchAndAssocComponent(id)
  await Promise.all([
    Builder.generateComponentVariants(_state, id),
    Builder.generateIncrement(_state, change)
  ])
}

async function removeComponent (id, change) {
  _state = R.dissocPath(['components', id], _state)
  await Builder.generateIncrement(_state, change)
}

async function regenerateVariant (id, change) {
  const componentId = VariantUtil.variantIdToComponentId(id)
  const component = await fetchAndAssocComponent(componentId)
  const variant = R.find(variant => variant.id === id)(component.variants)
  await Promise.all([
    Builder.generateVariant(_state, variant),
    Builder.generateIncrement(_state, change)
  ])
}

async function removeVariant (id, change) {
  const componentId = VariantUtil.variantIdToComponentId(id)
  await fetchAndAssocComponent(componentId)
  await Builder.generateIncrement(_state, change)
}

async function regenerateTemplate (id, change) {
  await Promise.all([
    Builder.generatePagesWithTemplate(_state, id),
    Builder.generateIncrement(_state, change)
  ])
}

module.exports = {
  init,
  isGenerating,
  generate,
  generateIncrementForFileChange
}
