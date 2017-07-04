const R = require('ramda')
const PageUtil = require('./util/page')
const { error } = require('./util/message')
const NavigationData = require('./data/navigation')

const assocNavigation = (nav, item) =>
  R.assoc(item.id, item, nav)

const itemsForPageId = (state, id) => {
  const { pages } = state
  const page = pages[id]

  // page
  const pageData = dataForPage(state, page)

  // component childpages
  const componentIds = page.componentIds || []
  const componentData = R.partial(dataForPageComponentId, [state, page])
  const componentsData = R.map(componentData, componentIds)

  const data = [pageData, ...componentsData]

  return data
}

const dataForPage = (state, page) => {
  const { pages, components } = state
  const pageId = page.id
  const pageIds = Object.keys(pages)
  const availableComponentIds = components ? Object.keys(components) : []
  const componentIds = page.componentIds || []
  const componentPageIds = R.map(componentId => {
    if (availableComponentIds.includes(componentId)) {
      return PageUtil.pageIdForComponentId(pageId, componentId)
    } else {
      throw new Error(error([
        `Component "${componentId}" does not exist, but was inserted on page "${pageId}".`,
        'Here is a list of available components:',
        `${availableComponentIds.map(id => `- ${id}`).join('\n')}`
      ].join('\n')))
    }
  }, componentIds)
  const parentId = PageUtil.parentIdForPageId(pageIds, pageId)
  const parent = pages[parentId]
  const childIds = page.childIds.concat(componentPageIds)
  const relations = dataForPageRelations(pageIds, pageId, parent)
  const data = NavigationData(pageId, page.title, page.path, childIds, parentId, relations)

  return data
}

const dataForPageComponentId = (state, parent, id) => {
  const { components, pages } = state
  const component = components[id]
  const pageIds = Object.keys(pages)
  const pageId = PageUtil.pageIdForComponentId(parent.id, component.id)
  const pagePath = PageUtil.pagePathForComponentId(parent.path, component.id)
  const parentId = PageUtil.parentIdForPageId(pageIds, pageId)
  const childIds = []
  const relations = dataForPageRelations(pageIds, pageId, parent)
  const data = NavigationData(pageId, component.title, pagePath, childIds, parentId, relations)

  return data
}

const dataForPageRelations = (pageIds, pageId, parent) => {
  let siblings = []
  if (parent) {
    const parentPrefix = PageUtil.pageIdToPath(parent.id)
    const parentComponentPageIds = R.map((componentId) => `${parentPrefix}/${componentId}`, parent.componentIds || [])
    siblings = (parent.childIds || []).concat(parentComponentPageIds)
  }

  const parentIds = PageUtil.parentIdsForPageId(pageIds, pageId)
  const indexInSiblings = R.indexOf(pageId, siblings)
  const siblingsBeforeIds = R.dropLast(siblings.length - indexInSiblings, siblings)
  const siblingsAfterIds = R.drop(indexInSiblings + 1, siblings)
  const siblingBeforeId = R.last(siblingsBeforeIds)
  const siblingAfterId = R.head(siblingsAfterIds)

  return { parentIds, siblingBeforeId, siblingsBeforeIds, siblingAfterId, siblingsAfterIds }
}

async function fetch (state) {
  return new Promise((resolve, reject) => {
    const pageIds = Object.keys(state.pages)
    const pageNavigationItems = R.partial(itemsForPageId, [state])
    const navigationItems = R.chain(pageNavigationItems, pageIds)
    const navigation = R.reduce(assocNavigation, {}, navigationItems)

    resolve(navigation)
  })
}

async function fetchForPageId (state, id) {
  return new Promise((resolve, reject) => {
    const navigation = itemsForPageId(state, id)
    resolve(navigation)
  })
}

module.exports = {
  fetch,
  fetchForPageId
}
