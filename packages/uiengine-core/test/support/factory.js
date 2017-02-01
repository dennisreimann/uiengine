module.exports = {
  page (id, { childIds = [], files = [], path = null, template = 'page' } = {}) {
    const pagePath = path || (id === 'index' ? '' : id)
    return { id, childIds, files, template, path: pagePath }
  }
}
