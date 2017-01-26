const R = require('ramda')
const NavigationData = require('./data/navigation')
const PageUtil = require('./util/page')

const assocNavigation = (siteNav, pageNav) =>
  R.assoc(pageNav.id, pageNav, siteNav)

const dataForPageId = (pages, pageId) => {
  const page = pages[pageId]
  const parentId = PageUtil.parentIdForPageId(pageId)
  const parentIds = PageUtil.parentIdsForPageId(pageId)
  // const collectChildren = R.partial(dataForPageId, [pages])
  // const children = R.map(collectChildren, page.children)
  const children = page.children
  const data = NavigationData(pageId, parentId, parentIds, children)

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
