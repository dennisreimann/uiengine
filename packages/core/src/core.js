const { basename } = require('path')
const R = require('ramda')
const Config = require('./configuration')
const Builder = require('./builder')
const Navigation = require('./navigation')
const Component = require('./component')
const Page = require('./page')
const Interface = require('./interface')
const Connector = require('./connector')
const Plugin = require('./plugin')
const {
  ComponentUtil: { componentFilePathToId, componentPathToId },
  FileUtil: { relativeToCwd },
  PageUtil: { pageFilePathToId, parentIdForPageId },
  TemplateUtil: { templateFilePathToId },
  VariantUtil: { variantFilePathToIdPrefix, variantIdToComponentId },
  DebugUtil: { debug2 }
} = require('@uiengine/util')

// set the state in this modules scope so that we
// can access it when handling incremental changes
let _state = {}

// track the state of a running generate process to
// cancel regenerating during a full generate
let _isGenerating = false
const isGenerating = () => _isGenerating

// recursively get dependents and their dependents
const aggregateDependentComponents = (components, id) => {
  const aggregate = componentId => {
    const { dependentComponents } = components[componentId]

    if (dependentComponents) {
      const nonCyclicList = R.reject(dependentId => {
        const { dependentComponents: dependentDependents } = components[dependentId]
        return dependentDependents && dependentDependents.includes(componentId)
      }, dependentComponents)

      return dependentComponents.concat(...R.map(aggregate, nonCyclicList))
    } else {
      return []
    }
  }
  const results = R.uniq(aggregate(id))

  return R.reject(componentId => componentId === id, results)
}

async function init (options = {}) {
  const config = await Config.read(options)

  return { config }
}

async function generate (options) {
  _isGenerating = true

  try {
    _state = await init(options)

    debug2(_state, 'Core.generate():start')

    // 1. setup and data fetching
    const setupInterface = Interface.setup(_state)
    const setupConnector = Connector.setup(_state)
    const setupPlugins = Plugin.setup(_state)
    const fetchPages = Page.fetchAll(_state)
    const fetchComponents = Component.fetchAll(_state)
    const [pages, components, plugins] = await Promise.all([fetchPages, fetchComponents, setupPlugins, setupInterface, setupConnector])

    _state = R.assoc('plugins', plugins, _state)
    _state = R.assoc('pages', pages, _state)
    _state = R.assoc('components', components, _state)

    // 2. transformations
    const navigation = await Navigation.fetch(_state)

    _state = R.assoc('navigation', navigation, _state)

    // 3. output
    await Builder.generate(_state)
  } finally {
    _isGenerating = false

    debug2(_state, 'Core.generate():end')
  }

  return _state
}

const getChangeObject = (filePath, action) => {
  const { source: { components, pages, templates } } = _state.config
  const file = relativeToCwd(filePath)
  const pageId = pages ? pageFilePathToId(pages, filePath) : undefined
  const templateId = templates ? templateFilePathToId(templates, filePath) : undefined
  const variantIdPrefix = components ? variantFilePathToIdPrefix(components, filePath) : undefined
  const componentId = components ? componentFilePathToId(components, filePath) || componentPathToId(components, filePath) : undefined

  if (pageId) {
    return { file, filePath, action, type: 'page', item: pageId }
  } else if (variantIdPrefix) {
    return { file, filePath, action, type: 'variant', item: variantIdPrefix }
  } else if (componentId) {
    return { file, filePath, action, type: 'component', item: componentId }
  } else if (templateId) {
    return { file, filePath, action, type: 'template', item: templateId }
  } else {
    return { file, filePath, action, type: 'site', item: _state.config.name }
  }
}

async function generateIncrementForFileChange (filePath, action = 'changed') {
  const change = getChangeObject(filePath, action)
  const isDeleted = action === 'deleted'
  let fn

  switch (change.type) {
    case 'page': {
      fn = isDeleted ? removePage : regeneratePage
      await fn(change.item)
      break
    }
    case 'variant': {
      fn = isDeleted ? removeVariant : regenerateVariant
      await fn(change.item)
      break
    }
    case 'component': {
      // check whether a file has been deleted or the component directory
      const isDirectory = basename(filePath) === change.item
      if (isDeleted && isDirectory) {
        await removeComponent(change.item)
      } else {
        await regenerateComponent(change.item)
      }
      break
    }
    case 'template': {
      await regenerateTemplate(change.item)
      break
    }
    default: {
      await generate({ config: _state.config.source.configFile })
      break
    }
  }

  return { state: _state, change }
}

async function fetchAndAssocPage (id) {
  const page = await Page.fetchById(_state, id)
  _state = R.assocPath(['pages', id], page, _state)
  return page
}

async function fetchAndAssocComponent (id) {
  const component = await Component.fetchById(_state, id)
  _state = R.assocPath(['components', id], component, _state)
  return component
}

async function fetchAndAssocVariants (id) {
  const variants = await Component.refetchVariants(_state, id)
  _state = R.assocPath(['components', id, 'variants'], variants, _state)
  return variants
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
    Builder.generatePage(_state, id),
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

async function regenerateComponent (id) {
  const { dependentComponents, dependentTemplates } = _state.components[id] || {}

  // the component
  const tasks = [fetchAndAssocComponent(id)]

  // its dependent components and recursively their dependents
  if (dependentComponents) {
    const allDependentComponents = aggregateDependentComponents(_state.components, id)
    const variantsBuilds = R.map(regenerateVariants, allDependentComponents)
    tasks.push(...variantsBuilds)
  }

  // its dependent templates
  if (dependentTemplates) {
    const pageBuild = R.partial(Builder.generatePagesWithTemplate, [_state])
    const pageBuilds = R.map(pageBuild, dependentTemplates)
    tasks.push(...pageBuilds)
  }

  await Promise.all(tasks)

  await Promise.all([
    fetchAndAssocNavigation(),
    Builder.generateComponentVariants(_state, id),
    Builder.generateIncrement(_state)
  ])
}

async function removeComponent (id) {
  _state = R.dissocPath(['components', id], _state)
  await Builder.generateIncrement(_state)
}

async function regenerateVariants (id) {
  await fetchAndAssocVariants(id)
  await Builder.generateComponentVariants(_state, id)
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

module.exports = {
  isGenerating,
  init,
  generate,
  generateIncrementForFileChange
}
