const R = require('ramda')
const {
  UiengineInputError,
  StringUtil: { hasContent },
  PageUtil: { isDocumentationPage, isIndexPage, pageIdForComponentId, pageIdToPath, pagePathForComponentId, parentIdForPageId }
} = require('@uiengine/util')

const assocNavigation = (navigation, entry) =>
  R.assoc(entry.id, entry, navigation)

const dataForPageId = (state, id) => {
  const { pages, components } = state

  // page
  const page = pages[id]
  const availableComponentIds = components ? Object.keys(components) : []
  const componentIds = page.componentIds || []
  const componentPageIds = R.map(componentId => {
    if (availableComponentIds.includes(componentId)) {
      return pageIdForComponentId(id, componentId)
    } else {
      throw new UiengineInputError([
        `Component "${componentId}" does not exist, but was inserted on page "${id}".`,
        'Here is a list of available components:',
        availableComponentIds.map(id => `- ${id}`).join('\n')
      ])
    }
  }, componentIds)
  const childIds = page.childIds.concat(componentPageIds)
  const relations = dataForRelations(pages, id, childIds)
  const data = R.merge(relations, {
    id: id,
    itemId: id,
    isStructural: isDocumentationPage(page.type) && !hasContent(page.content),
    path: isIndexPage(id) ? '/' : `/${page.path}/`,
    type: page.type,
    title: page.title,
    keywords: (page.keywords || []).concat(page.tags || [])
  })

  if (!data.isStructural) delete data.isStructural
  if (page.collapsed) data.collapsed = true
  if (data.keywords.length === 0) delete data.keywords

  // component childpages
  const componentData = R.partial(dataForComponentId, [state, page])
  const componentsData = R.map(componentData, componentIds)

  return [data, ...componentsData]
}

const dataForComponentId = (state, parent, id) => {
  const { components, pages } = state
  const component = components[id]
  const pageId = pageIdForComponentId(parent.id, component.id)
  const pagePath = pagePathForComponentId(parent.path, component.id)
  const relations = dataForRelations(pages, pageId, [])
  const variantTags = R.uniq(R.flatten(R.pluck('tags', component.variants)))
  const data = R.merge(relations, {
    id: pageId,
    itemId: id,
    path: `/${pagePath}/`,
    type: component.type,
    title: component.title,
    keywords: (component.keywords || []).concat(component.tags || []).concat(variantTags)
  })

  if (data.keywords.length === 0) delete data.keywords

  return data
}

const dataForRelations = (pages, id, childIds) => {
  let siblings = []
  const data = {}
  const pageIds = Object.keys(pages)
  const parentId = parentIdForPageId(pageIds, id)
  const parent = pages[parentId]

  if (parent) {
    const parentPrefix = pageIdToPath(parent.id)
    const parentComponentPageIds = R.map(componentId => `${parentPrefix}/${componentId}`, parent.componentIds || [])
    siblings = (parent.childIds || []).concat(parentComponentPageIds)
  }

  const indexInSiblings = R.indexOf(id, siblings)
  if (indexInSiblings > 0) data.prevSiblingId = siblings[indexInSiblings - 1]
  if (indexInSiblings < siblings.length - 1) data.nextSiblingId = siblings[indexInSiblings + 1]
  if (childIds.length) data.childIds = childIds
  if (parentId) data.parentId = parentId

  return data
}

async function fetch (state) {
  const ids = Object.keys(state.pages)
  const data = R.partial(dataForPageId, [state])
  const navigationData = R.chain(data, ids)
  const navigation = R.reduce(assocNavigation, {}, navigationData)

  return navigation
}

async function fetchForPageId (state, id) {
  return dataForPageId(state, id)
}

module.exports = {
  fetch,
  fetchForPageId
}
