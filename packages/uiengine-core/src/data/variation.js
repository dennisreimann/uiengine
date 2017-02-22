const R = require('ramda')

module.exports = (id, componentId, path, content, rendered, context = {}, attributes) => {
  const baseData = {
    id,
    componentId,
    path,
    content,
    rendered,
    context
  }

  return R.mergeAll([attributes, baseData])
}
