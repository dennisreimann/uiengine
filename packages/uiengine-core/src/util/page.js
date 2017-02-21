const path = require('path')
const R = require('ramda')
const StringUtil = require('./string')

const PAGE_FILENAME = 'page.md'
const INDEX_ID = 'index'
const INDEX_PATH = '.'

const isIndexPage = (pageId) => pageId === INDEX_ID
const isIndexPath = (pagePath) => pagePath === INDEX_PATH

const pageIdToPath = (pageId) => isIndexPage(pageId) ? '' : pageId

const pageIdToTitle = (pageId) => {
  if (isIndexPage(pageId)) return 'Home'

  const basename = path.basename(pageId)
  const title = StringUtil.titleize(basename)

  return title
}

const pageIdToPageFilePath = (pagesPath, pageId) => {
  const relativePath = isIndexPage(pageId) ? INDEX_PATH : pageId
  const absolutePath = path.join(pagesPath, relativePath, PAGE_FILENAME)

  return absolutePath
}

const pageFilePathToPageId = (pagesPath, pageFilePath) => {
  const relativePath = path.relative(pagesPath, pageFilePath)

  // invalid path: this is not a page
  if (relativePath.startsWith('..')) return null

  const dirname = path.dirname(relativePath)
  const pageId = isIndexPath(dirname) ? INDEX_ID : dirname

  return pageId
}

const pageIdForComponentId = (parentPageId, componentId) =>
  `${pageIdToPath(parentPageId)}/${componentId}`

const pagePathForComponentId = (parentPagePath, componentId) =>
  `${parentPagePath}/${componentId}`

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

// turns the list of children from the user provided attributes
// into a list of correctly named childIds
const convertUserProvidedChildrenList = (pageId, attributes = {}) => {
  let { children } = attributes
  if (typeof children !== 'object') return attributes

  const prefix = pageIdToPath(pageId)
  const childIds = R.map((id) =>
    id.startsWith(prefix) ? id : `${prefix}/${id}`,
    children
  )

  attributes = R.dissoc('children', attributes)
  attributes = R.assoc('childIds', childIds, attributes)

  return attributes
}

// turns the list of components from the user provided attributes
// into a list of correctly named componentIds
const convertUserProvidedComponentsList = (pageId, attributes = {}) => {
  let { components } = attributes
  if (typeof components !== 'object') return attributes

  // const prefix = pageIdToPath(pageId)
  // const componentIds = R.map((id) =>
  //   id.startsWith(prefix) ? id : `${prefix}/${id}`,
  //   components
  // )

  attributes = R.dissoc('components', attributes)
  attributes = R.assoc('componentIds', components, attributes)

  return attributes
}

module.exports = {
  pageIdToPath,
  pageIdToTitle,
  pageIdToPageFilePath,
  pageIdForComponentId,
  pagePathForComponentId,
  pageFilePathToPageId,
  parentIdsForPageId,
  parentIdForPageId,
  convertUserProvidedChildrenList,
  convertUserProvidedComponentsList,
  PAGE_FILENAME
}
