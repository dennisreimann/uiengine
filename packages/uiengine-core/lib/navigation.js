const R = require('ramda')

const withRoot = (state, rootPageId) => {
  const root = state.pages[rootPageId]
  const collectChildren = R.partial(withRoot, [state])
  const children = R.map(collectChildren, root.children)

  const page = {
    id: root.id,
    children: children
  }

  return page
}

async function forPageIdAsRoot (state, rootPageId) {
  return new Promise((resolve, reject) => {
    const navigation = [withRoot(state, rootPageId)]
    resolve(navigation)
  })
}

module.exports = {
  forPageIdAsRoot
}
