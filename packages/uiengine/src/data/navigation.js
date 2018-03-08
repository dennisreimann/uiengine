const PageUtil = require('../util/page')
const StringUtil = require('../util/string')

module.exports = (id, itemId, title, pagePath, type, content, tags, childIds = [], parentId, { parentIds = [], siblingBeforeId = null, siblingsBeforeIds = [], siblingAfterId = null, siblingsAfterIds = [] } = {}) => {
  const isStructural = PageUtil.isDocumentationPage(type) && !StringUtil.hasContent(content)
  const excerpt = StringUtil.excerptFromContent(content)
  const path = PageUtil.isIndexPage(id) ? '/' : `/${pagePath}/`

  return {
    id,
    itemId,
    title,
    isStructural,
    path,
    type,
    tags,
    excerpt,
    childIds,
    parentId,
    parentIds,
    siblingBeforeId,
    siblingsBeforeIds,
    siblingAfterId,
    siblingsAfterIds
  }
}
