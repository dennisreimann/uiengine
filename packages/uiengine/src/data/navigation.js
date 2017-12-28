const PageUtil = require('../util/page')

module.exports = (id, itemId, title, pagePath, type, content, childIds = [], parentId, { parentIds = [], siblingBeforeId = null, siblingsBeforeIds = [], siblingAfterId = null, siblingsAfterIds = [] } = {}) => {
  const isStructural = PageUtil.isDocumentationPage(type) && !content
  return {
    id,
    itemId,
    title,
    isStructural,
    path: `/${pagePath}`,
    type,
    childIds,
    parentId,
    parentIds,
    siblingBeforeId,
    siblingsBeforeIds,
    siblingAfterId,
    siblingsAfterIds
  }
}
