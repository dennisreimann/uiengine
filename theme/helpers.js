const path = require('path')

const pageFile = 'index.html'

const revvedFile = (filePath) => {
  let revs
  try { revs = require(`./assets/rev-manifest.json`) } catch (err) { }
  return revs && revs[filePath] || filePath
}

const createLink = (toPath, fromPath) => {
  let relativePath = path.relative(fromPath, toPath)

  if (relativePath) {
    relativePath = relativePath.replace(/^\.\.\//, '')
  } else { // from == to
    relativePath = path.basename(toPath)
  }

  return relativePath
}

// function that binds the current page data and returns
// an object with helper functions based on that data
module.exports = (data) => {
  const { pages, page, navigation } = data

  return {
    assetPath (filePath) {
      const target = revvedFile(filePath)
      const source = path.join(page.path, pageFile)

      return createLink(target, source)
    },

    isCurrentPage (pageId) {
      return pageId === page.id
    },

    isActivePage (pageId) {
      return this.isCurrentPage(pageId) || navigation[page.id].parentIds.includes(pageId)
    },

    dasherize (string) {
      return string.replace(/\W+/gi, '-')
    },

    pageLink (pageId) {
      const targetPage = pages[pageId]
      const target = path.join(targetPage.path, pageFile)
      const source = path.join(page.path, pageFile)
      const href = createLink(target, source)

      return href
    }
  }
}
