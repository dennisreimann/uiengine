const PageUtil = require('../../src/util/page')
const StringUtil = require('../../src/util/string')

export function component (id, attrs = {}) {
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.type = attrs.type || 'component'
  attrs.variants = attrs.variants || []

  return Object.assign({}, attrs, { id })
}

export function page (id, attrs = {}) {
  attrs.path = attrs.path || (id === 'index' ? '' : id)
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.type = attrs.type || (attrs.tokens ? 'tokens' : (attrs.template ? 'template' : 'documentation'))
  attrs.files = attrs.files || []
  attrs.childIds = attrs.childIds || []
  attrs.componentIds = attrs.componentIds || []

  return Object.assign({}, attrs, { id })
}

export function navigation (id, { itemId, title, path, type = 'documentation', content = '', tags = [], childIds = [], parentId = null, prevSiblingId = null, nextSiblingId = null }) {
  return {
    isStructural: PageUtil.isDocumentationPage(type) && !StringUtil.hasContent(content),
    path: PageUtil.isIndexPage(id) ? '/' : `/${path}/`,
    id,
    itemId,
    title,
    type,
    tags,
    content,
    childIds,
    parentId,
    prevSiblingId,
    nextSiblingId
  }
}
