module.exports = {
  page (id, { childIds = [], path = null, template = 'page' } = {}) {
    const pagePath = path || (id === 'index' ? '' : id)
    return { id, childIds, template, path: pagePath }
  }
}
