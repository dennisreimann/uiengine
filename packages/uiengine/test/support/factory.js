export function component (id, attrs = {}) {
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.type = attrs.type || 'component'
  attrs.variantIds = attrs.variantIds || []

  return Object.assign({}, attrs, { id })
}

export function page (id, attrs = {}) {
  attrs.path = attrs.path || (id === 'index' ? '' : id)
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.type = attrs.type || (attrs.template ? 'template' : (attrs.tokens ? 'tokens' : 'documentation'))
  attrs.files = attrs.files || []
  attrs.childIds = attrs.childIds || []
  attrs.componentIds = attrs.componentIds || []

  return Object.assign({}, attrs, { id })
}
