const R = require('ramda')
const NavigationData = require('./data/navigation')
const PageUtil = require('./util/page')

const assocNavigation = (siteNav, pageNav) =>
  R.assoc(pageNav.id, pageNav, siteNav)

const dataForPageId = (pages, pageId) => {
  const page = pages[pageId]
  const childIds = page.childIds
  const parentId = PageUtil.parentIdForPageId(pageId)
  const parentIds = PageUtil.parentIdsForPageId(pageId)
  const parent = pages[parentId]
  const siblings = parent && parent.childIds || []
  const indexInSiblings = R.indexOf(pageId, siblings)
  const siblingsBeforeIds = R.dropLast(siblings.length - indexInSiblings, siblings)
  const siblingsAfterIds = R.drop(indexInSiblings + 1, siblings)
  const siblingBeforeId = R.last(siblingsBeforeIds)
  const siblingAfterId = R.head(siblingsAfterIds)
  const data = NavigationData(pageId, parentId, parentIds, childIds, siblingBeforeId, siblingsBeforeIds, siblingAfterId, siblingsAfterIds)

  return data
}

async function forPages ({ pages }) {
  return new Promise((resolve, reject) => {
    const pageIds = Object.keys(pages)
    const pageNavigation = R.partial(dataForPageId, [pages])
    const pageNavigations = R.map(pageNavigation, pageIds)
    const navigation = R.reduce(assocNavigation, {}, pageNavigations)

    resolve(navigation)
  })
}

async function forPageId ({ pages }, pageId) {
  return new Promise((resolve, reject) => {
    const navigation = dataForPageId(pages, pageId)
    resolve(navigation)
  })
}

module.exports = {
  forPages,
  forPageId
}
