const path = require('path')

const PAGE_FILENAME = 'page.md'
const INDEX_ID = 'index'
const INDEX_PATH = '.'

const isIndexPage = (pageId) => pageId === INDEX_ID
const isIndexPath = (pagePath) => pagePath === INDEX_PATH

const pageIdToPath = (pageId) => isIndexPage(pageId) ? '' : pageId

const pageIdToTitle = (pageId) => {
  if (isIndexPage(pageId)) return 'Home'

  const basename = path.basename(pageId)
  const title = basename
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return title
}

const pageIdToPageFilePath = (pagesPath, pageId) => {
  const relativePath = isIndexPage(pageId) ? INDEX_PATH : pageId
  const absolutePath = path.join(pagesPath, relativePath, PAGE_FILENAME)

  return absolutePath
}

const pageFilePathToPageId = (pagesPath, pageFilePath) => {
  const relativePath = path.relative(pagesPath, pageFilePath)
  const dirname = path.dirname(relativePath)
  const pageId = isIndexPath(dirname) ? INDEX_ID : dirname

  return pageId
}

const parentIdForPageId = (pageId) => {
  if (isIndexPage(pageId)) return null
  const parentDir = path.dirname(pageId)
  const parentId = isIndexPath(parentDir) ? INDEX_ID : parentDir

  return parentId
}

const parentIdsForPageId = (pageId) => {
  if (isIndexPage(pageId)) return []
  const parentId = parentIdForPageId(pageId)
  const parentIds = parentIdsForPageId(parentId)
  parentIds.push(parentId)

  return parentIds
}

module.exports = {
  pageIdToPath,
  pageIdToTitle,
  pageIdToPageFilePath,
  pageFilePathToPageId,
  parentIdsForPageId,
  parentIdForPageId,
  PAGE_FILENAME
}
