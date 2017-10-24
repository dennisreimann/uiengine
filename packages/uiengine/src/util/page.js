const path = require('path')
const R = require('ramda')
const File = require('./file')
const StringUtil = require('./string')
const { error } = require('./message')

const PAGE_FILENAME = 'page.md'
const INDEX_ID = 'index'
const INDEX_FILE_PATH = '.'
const INDEX_PAGE_PATH = ''
const SCHEMA_ID = 'schema'
const SCHEMA_PAGE_PATH = '_schema'

// types
const PAGE_TYPE_TOKENS = 'tokens'
const PAGE_TYPE_TEMPLATE = 'template'
const PAGE_TYPE_DOCUMENTATION = 'documentation'

const isIndexPage = (pageId) =>
  pageId === INDEX_ID

const isIndexFilePath = (pagePath) =>
  pagePath === INDEX_FILE_PATH

const isIndexPagePath = (pagePath) =>
  pagePath === INDEX_PAGE_PATH

const isTokensPage = pageType =>
  pageType === PAGE_TYPE_TOKENS

const isTemplatePage = pageType =>
  pageType === PAGE_TYPE_TEMPLATE

const isDocumentationPage = pageType =>
  pageType === PAGE_TYPE_DOCUMENTATION

const pageIdToPath = (pageId) =>
  isIndexPage(pageId) ? INDEX_PAGE_PATH : pageId

const pageIdForComponentId = (parentPageId, componentId) =>
  isIndexPage(parentPageId) ? componentId : `${pageIdToPath(parentPageId)}/${componentId}`

const pagePathForComponentId = (parentPagePath, componentId) =>
  isIndexPagePath(parentPagePath) ? componentId : `${parentPagePath}/${componentId}`

const pageIdToTitle = (pageId) => {
  if (isIndexPage(pageId)) return 'Home'

  const basename = path.basename(pageId)
  const title = StringUtil.titleize(basename)

  return title
}

const pageIdToPageFilePath = (pagesPath, pageId) => {
  const relativePath = isIndexPage(pageId) ? INDEX_FILE_PATH : pageId
  const absolutePath = path.join(pagesPath, relativePath, PAGE_FILENAME)

  return absolutePath
}

const pageFilePathToPageId = (pagesPath, pageFilePath) => {
  const relativePath = path.relative(pagesPath, pageFilePath)

  // invalid path: this is not a page
  if (relativePath.startsWith('..')) return null

  const dirname = path.dirname(relativePath)
  const filename = path.basename(relativePath)

  if (filename === PAGE_FILENAME || File.exists(path.resolve(pageFilePath, '..', PAGE_FILENAME))) {
    const pageId = isIndexFilePath(dirname) ? INDEX_ID : dirname

    return pageId
  } else {
    const parentPath = path.resolve(pageFilePath, '..', '..')
    const parentPageFilePath = path.join(parentPath, filename)

    return pageFilePathToPageId(pagesPath, parentPageFilePath)
  }
}

const parentIdForPageId = (pageIds, pageId) => {
  if (isIndexPage(pageId)) return null
  const parentDir = path.dirname(pageId)
  const parentId = isIndexFilePath(parentDir) ? INDEX_ID : parentDir

  if (pageIds.includes(parentId)) {
    return parentId
  } else {
    return parentIdForPageId(pageIds, parentId)
  }
}

const parentIdsForPageId = (pageIds, pageId) => {
  if (isIndexPage(pageId)) return []
  const parentId = parentIdForPageId(pageIds, pageId)
  const parentIds = parentIdsForPageId(pageIds, parentId)
  parentIds.push(parentId)

  return parentIds
}

const determineType = (attributes) => {
  if (attributes.template) {
    return PAGE_TYPE_TEMPLATE
  } else if (attributes.tokens) {
    return PAGE_TYPE_TOKENS
  } else {
    return PAGE_TYPE_DOCUMENTATION
  }
}

// resolve title from attributes, use markdown heading or page id as fallback
const determineTitle = (id, attributes, content) => {
  let { title } = attributes
  if (!title) {
    const [, heading] = (content && content.match(/<h1.*?>(.*?)<\/h1>/)) || []
    title = heading || pageIdToTitle(id)
  }
  return title
}

// turns the list of children from the user provided attributes
// into a list of correctly named childIds
const convertUserProvidedChildrenList = (pageId, availableChildIds, attributes = {}) => {
  let { children } = attributes
  if (typeof children !== 'object') return attributes

  const prefix = pageIdToPath(pageId)
  const childIds = R.map(id => {
    const childId = id.startsWith(prefix) ? id : `${prefix}/${id}`
    if (availableChildIds.includes(childId)) {
      return childId
    } else {
      throw new Error(error([
        `Child page "${id}" does not exist for page "${pageId}".`,
        'Here is a list of available child pages:',
        `${availableChildIds.map(childId => `- ${childId}`).join('\n')}`
      ].join('\n')))
    }
  }, children)

  attributes = R.dissoc('children', attributes)
  attributes = R.assoc('childIds', childIds, attributes)

  return attributes
}

// turns the list of components from the user provided attributes
// into a list of correctly named componentIds
const convertUserProvidedComponentsList = (pageId, attributes = {}) => {
  let { components } = attributes
  if (typeof components !== 'object') return attributes

  attributes = R.dissoc('components', attributes)
  attributes = R.assoc('componentIds', components, attributes)

  return attributes
}

module.exports = {
  isIndexPage,
  isIndexPagePath,
  isIndexFilePath,
  isTemplatePage,
  isTokensPage,
  isDocumentationPage,
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
  determineType,
  determineTitle,
  PAGE_FILENAME,
  INDEX_ID,
  SCHEMA_ID,
  SCHEMA_PAGE_PATH
}
