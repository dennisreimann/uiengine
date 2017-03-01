export function component (id, attrs = {}) {
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.template = attrs.template || 'theme:component'
  attrs.variationIds = attrs.variationIds || []

  return Object.assign({}, attrs, { id })
}

export function page (id, attrs = {}) {
  attrs.path = attrs.path || (id === 'index' ? '' : id)
  attrs.title = attrs.title || id
  attrs.content = attrs.content || ''
  attrs.template = attrs.template || 'theme:page'
  attrs.files = attrs.files || []
  attrs.childIds = attrs.childIds || []
  attrs.componentIds = attrs.componentIds || []

  return Object.assign({}, attrs, { id })
}
