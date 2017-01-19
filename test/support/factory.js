module.exports = {
  page (id, { children = [], path = null, template = 'testTemplate' } = {}) {
    return { id, children, template, path: (path || id) }
  }
}
