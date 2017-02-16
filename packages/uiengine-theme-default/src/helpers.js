import path from 'path'

const pageFile = 'index.html'
const assetsDir = '_uiengine-theme'
const manifestPath = path.resolve(__dirname, '..', 'static', assetsDir, 'rev-manifest.json')

const revvedFile = (filePath) => {
  let revs
  try { revs = require(manifestPath) } catch (err) { }
  const file = revs && revs[filePath] || filePath
  return `${assetsDir}/${file}`
}

const relativePath = (toPath, fromPath) => {
  const relative = path.relative(fromPath, toPath)

  if (relative) {
    return relative.replace(/^\.\.\//, '')
  } else { // from == to
    return path.basename(toPath)
  }
}

// function that binds the current page data and returns
// an object with helper functions based on that data
export default function (data) {
  const { page, pages, navigation } = data

  return {
    assetPath (filePath) {
      const target = revvedFile(filePath)
      const source = path.join(page.path, pageFile)

      return relativePath(target, source)
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
      const href = relativePath(target, source)

      return href
    }
  }
}
