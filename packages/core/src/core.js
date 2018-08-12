const { basename, dirname, relative } = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Page = require('./page')
const Entity = require('./entity')
const Interface = require('./interface')
const Connector = require('./connector')
const {
  EntityUtil: { entityFilePathToEntityId },
  ComponentUtil: { componentFilePathToComponentId, componentPathToComponentId },
  PageUtil: { pageFilePathToPageId, parentIdForPageId },
  TemplateUtil: { templateFilePathToTemplateId },
  VariantUtil: { variantFilePathToIdPrefix, variantIdToComponentId },
  DebugUtil: { debug2 }
} = require('@uiengine/util')

// set the state in this modules scope so that we
// can access it when handling incremental changes
let _state = {}

// track the state of a running generate process to
// cancel regenerating during a full generate
let _isGenerating = false
export const isGenerating = () => _isGenerating

export async function init (options = {}) {
  const config = await Config.read(options)

  return { config }
}

export async function generate (options) {
  _isGenerating = true

  try {
    _state = await init(options)

    debug2(_state, 'Core.generate():start')

    // 0. setup
    const setupInterface = Interface.setup(_state)
    const setupConnector = Connector.setup(_state)
    await Promise.all([setupInterface, setupConnector])

    // 1. data fetching
    const fetchPages = Page.fetchAll(_state)
    const fetchEntities = Entity.fetchAll(_state)
    const fetchComponents = Component.fetchAll(_state)
    const [pages, entities, components] = await Promise.all([fetchPages, fetchEntities, fetchComponents])

    _state = R.assoc('pages', pages, _state)
    _state = R.assoc('entities', entities, _state)
    _state = R.assoc('components', components, _state)

    // 2. transformations
    const entitiesPage = await Page.fetchEntitiesPage(_state)
    _state = R.assocPath(['pages', entitiesPage.id], entitiesPage, _state)

    const navigation = await Navigation.fetch(_state)
    _state = R.assoc('navigation', navigation, _state)

    // 3. output
    await Builder.generate(_state)
  } catch (err) {
    throw err
  } finally {
    _isGenerating = false

    debug2(_state, 'Core.generate():end')
  }

  return _state
}

const getChangeObject = (filePath, action) => {
  const { source: { components, pages, templates, data, entities } } = _state.config
  const file = relative(process.cwd(), filePath)
  const isComponentDir = dirname(filePath) === components
  const isEntityFile = entities && !!filePath.startsWith(entities)
  const isDataFile = !isEntityFile && data && !!filePath.startsWith(data)
  let pageId, componentId, templateId, entityId, variantIdPrefix

  // Skip generating individual items in case the data
  // got changed as we need to regenerate everything
  if (!isDataFile) {
    pageId = pages ? pageFilePathToPageId(pages, filePath) : undefined
    entityId = entities ? entityFilePathToEntityId(entities, filePath) : undefined
    templateId = templates ? templateFilePathToTemplateId(templates, filePath) : undefined
    componentId = components ? componentFilePathToComponentId(components, filePath) : undefined
    variantIdPrefix = components ? variantFilePathToIdPrefix(components, filePath) : undefined
  }

  // In case a component directory has been deleted we
  // need to reset the component id with the dirname
  if (componentId && isComponentDir) {
    componentId = componentPathToComponentId(components, filePath)
  }

  if (pageId) {
    return { file, filePath, action, type: 'page', item: pageId }
  } else if (variantIdPrefix) {
    return { file, filePath, action, type: 'variant', item: variantIdPrefix }
  } else if (componentId) {
    return { file, filePath, action, type: 'component', item: componentId }
  } else if (entityId) {
    return { file, filePath, action, type: 'entity', item: entityId }
  } else if (templateId) {
    return { file, filePath, action, type: 'template', item: templateId }
  } else {
    return { file, filePath, action, type: 'site', item: _state.config.name }
  }
}

export async function generateIncrementForFileChange (filePath, action = 'changed') {
  const change = getChangeObject(filePath, action)
  const isDeleted = action === 'deleted'
  let fn

  switch (change.type) {
    case 'page':
      fn = isDeleted ? removePage : regeneratePage
      await fn(change.item)
      break

    case 'variant':
      fn = isDeleted ? removeVariant : regenerateVariant
      await fn(change.item)
      break

    case 'entity':
      fn = isDeleted ? removeEntity : regenerateEntity
      await fn(change.item)
      break

    case 'component':
      // check whether a file has been deleted or the component directory
      const isDirectory = basename(filePath) === change.item
      if (isDeleted && isDirectory) {
        await removeComponent(change.item)
      } else {
        await regenerateComponent(change.item)
      }
      break

    case 'template':
      await regenerateTemplate(change.item)
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

async function fetchAndAssocEntitiesPage () {
  const page = await Page.fetchEntitiesPage(_state)
  _state = R.assocPath(['pages', page.id], page, _state)
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

async function regeneratePage (id) {
  const pageIds = Object.keys(_state.pages)
  const parentId = parentIdForPageId(pageIds, id)
  const fetchTasks = [fetchAndAssocPage(id)]
  if (parentId) fetchTasks.push(fetchAndAssocPage(parentId))

  await Promise.all(fetchTasks)
  await fetchAndAssocNavigation()
  await Promise.all([
    Builder.generatePageWithTemplate(_state, id),
    Builder.generatePageWithTokens(_state, id),
    Builder.generatePageFiles(_state, id),
    Builder.generateIncrement(_state)
  ])
}

async function removePage (id) {
  const pageIds = Object.keys(_state.pages)
  const parentId = parentIdForPageId(pageIds, id)

  _state = R.dissocPath(['pages', id], _state)

  await fetchAndAssocPage(parentId)
  await fetchAndAssocNavigation()
  await Builder.generateIncrement(_state)
}

async function regenerateEntity (id) {
  await fetchAndAssocEntity(id)
  await fetchAndAssocEntitiesPage()
  await Builder.generateIncrement(_state)
}

async function removeEntity (id) {
  _state = R.dissocPath(['entities', id], _state)
  await Builder.generateIncrement(_state)
}

async function regenerateComponent (id) {
  await fetchAndAssocComponent(id)
  await Promise.all([
    Builder.generateComponentVariants(_state, id),
    Builder.generateIncrement(_state)
  ])
}

async function removeComponent (id) {
  _state = R.dissocPath(['components', id], _state)
  await Builder.generateIncrement(_state)
}

async function regenerateVariant (idPrefix) {
  const componentId = variantIdToComponentId(idPrefix)
  const component = await fetchAndAssocComponent(componentId)
  const variants = R.filter(variant => variant.id.startsWith(idPrefix))(component.variants)
  const variantBuild = R.partial(Builder.generateVariant, [_state])
  const variantBuilds = R.map(variantBuild, variants)

  await Promise.all([
    ...variantBuilds,
    Builder.generateIncrement(_state)
  ])
}

async function removeVariant (idPrefix) {
  const componentId = variantIdToComponentId(idPrefix)
  await fetchAndAssocComponent(componentId)
  await Builder.generateIncrement(_state)
}

async function regenerateTemplate (id) {
  await Promise.all([
    Builder.generateVariantsWithTemplate(_state, id),
    Builder.generateTokensWithTemplate(_state, id),
    Builder.generatePagesWithTemplate(_state, id),
    Builder.generateIncrement(_state)
  ])
}
