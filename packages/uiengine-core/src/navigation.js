const R = require('ramda')
const NavigationData = require('./data/navigation')
const PageUtil = require('./util/page')

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

const siblingsWithParentPage = (parent) => {
  if (parent) {
    const parentPrefix = PageUtil.pageIdToPath(parent.id)
    const parentComponentPageIds = R.map((componentId) => `${parentPrefix}/${componentId}`, parent.componentIds || [])

    return (parent.childIds || []).concat(parentComponentPageIds)
  } else {
    return []
  }
}

const dataForPage = (state, page) => {
  const { pages } = state
  const pageId = page.id
  const componentIds = page.componentIds || []
  const componentPageIds = R.map((componentId) => PageUtil.pageIdForComponentId(pageId, componentId), componentIds)
  const childIds = page.childIds.concat(componentPageIds)
  const parentId = PageUtil.parentIdForPageId(pageId)
  const parentIds = PageUtil.parentIdsForPageId(pageId)
  const parent = pages[parentId]

  const siblings = siblingsWithParentPage(parent)
  const indexInSiblings = R.indexOf(pageId, siblings)
  const siblingsBeforeIds = R.dropLast(siblings.length - indexInSiblings, siblings)
  const siblingsAfterIds = R.drop(indexInSiblings + 1, siblings)
  const siblingBeforeId = R.last(siblingsBeforeIds)
  const siblingAfterId = R.head(siblingsAfterIds)

  const data = NavigationData(pageId, page.title, page.path, parentId, parentIds, childIds, siblingBeforeId, siblingsBeforeIds, siblingAfterId, siblingsAfterIds)

  return data
}

// FIXME: dataForPage and dataForPageComponentId share
// a lot of code. Refactor this!

const dataForPageComponentId = (state, parent, id) => {
  const { components } = state
  const component = components[id]
  const pageId = PageUtil.pageIdForComponentId(parent.id, component.id)
  const pagePath = PageUtil.pagePathForComponentId(parent.path, component.id)
  const childIds = []
  const parentId = PageUtil.parentIdForPageId(pageId)
  const parentIds = PageUtil.parentIdsForPageId(pageId)

  const siblings = siblingsWithParentPage(parent)
  const indexInSiblings = R.indexOf(pageId, siblings)
  const siblingsBeforeIds = R.dropLast(siblings.length - indexInSiblings, siblings)
  const siblingsAfterIds = R.drop(indexInSiblings + 1, siblings)
  const siblingBeforeId = R.last(siblingsBeforeIds)
  const siblingAfterId = R.head(siblingsAfterIds)

  const data = NavigationData(pageId, component.title, pagePath, parentId, parentIds, childIds, siblingBeforeId, siblingsBeforeIds, siblingAfterId, siblingsAfterIds)

  return data
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
