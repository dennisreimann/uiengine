module.exports = {
  page (id, { children = [], path = null, template = 'page' } = {}) {
    const pagePath = path || (id === 'index' ? '' : id)
    return { id, children, template, path: pagePath }
  }
}
