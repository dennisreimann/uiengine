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
  const { page, navigation } = data
  const currentItem = navigation[page.id]

  return {
    assetPath (filePath) {
      const target = revvedFile(filePath)
      const source = path.join(currentItem.path, pageFile)

      return relativePath(target, source)
    },

    dasherize (string) {
      return string.replace(/\W+/gi, '-')
    },

    isCurrentPage (item) {
      return item.id === currentItem.id
    },

    isActivePage (item) {
      return this.isCurrentPage(item) || (currentItem.parentIds.includes(item.id) && item.id !== 'index')
    },

    pageLink (item) {
      const target = path.join(item.path, pageFile)
      const source = path.join(currentItem.path, pageFile)
      const href = relativePath(target, source)

      return href
    }
  }
}
