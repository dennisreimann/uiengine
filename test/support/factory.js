module.exports = {
  component (id, { title = null, variationIds = [], content = '', template = 'component' } = {}) {
    title = title || id
    return { id, title, variationIds, content, template }
  },

  page (id, { title = null, childIds = [], componentIds = [], files = [], path = null, template = 'page', content = '' } = {}) {
    path = path || (id === 'index' ? '' : id)
    title = title || id
    return { id, path, title, childIds, componentIds, files, template, content }
  }
}
